import { configuration } from "../helpers/configuration";
import { hexdelete, hexget, hexpost } from "../helpers/hexapi";
import { isAllowedToUseArguments, throwIfNotVerified } from "../helpers/isValid";
import fetch from "node-fetch";
import { addHyphensToUuidString } from "../helpers/addHyphensToUuidString";

const rootResolver = {
  Query: {
    user: (parent: any, args: any, context: any, info: any) => {
      return hexget(`/api/guild/${args.guildId}/member/${args.memberId}/info`);
    },
    guild: (parent: any, args: any, context: any, info: any) => {
      return hexget(`/api/getmembers/${args.guildId}`);
    },
    currentUser: (parent: any, args: any, context: any, info: any) => {
      return context.currentUser;
    },
    currentGuilds: (parent: any, args: any, context: any, info: any) => {
      if (context.currentUser) {
        return [configuration.compsoc];
      } else {
        return [];
      }
    },
    gameTypes: () => {
      return configuration.games;
    },
  },
  Mutation: {
    createGameConnection: async (
      parent: any,
      args: any,
      context: any,
      info: any
    ) => {
      throwIfNotVerified(context)
      if (!isAllowedToUseArguments(args, context)) {
        throw new Error("You are not this user!");
      }

      let input = args.input;

      switch (args.input.gameId as string) {
        case "minecraft":
          const data = await fetch(
            `https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(
              args.input.gameUsername
            )}`
          ).then(res => res.status === 200 ? res.json() : null);

          if (data?.id) {
            input.gameUserId = addHyphensToUuidString(data.id);
            input.gameUsername = data.name
          } else {
            throw new Error("Failed to get UUID from Minecraft username");
          }
          break;
        default:
          throw new Error("Failed to resolve UUID from username");
      }

      return hexpost(
        `/api/games/bindings/create`,
        undefined,
        input
      );
    },
    deleteGameConnection: (parent: any, args: any, context: any, info: any) => {
      throwIfNotVerified(context)
      if (!isAllowedToUseArguments(args, context)) {
        throw new Error("You are not this user!");
      }
      return hexdelete(`/api/games/bindings/remove`, undefined, args.input);
    },
  },
  User: {
    games: (parent: any) => {
      return hexget(
        `/api/games/bindings/guild/${parent.guildId}/member/${parent.memberId}/list`
      );
    },
    studentVerified: (parent: any) => {
      if (parent && typeof parent.studentVerified === "boolean")
        return parent.studentVerified;
      return hexget(
        `/api/guild/${parent.guildId}/member/${parent.memberId}/info`
      ).then((data) => (data ? !!data.studentVerified : false));
    },
    guild: (parent: any) => {
      return hexget(`/api/getmembers/${parent.guildId}`);
    },
  },
  Guild: {
    users: (parent: any) => {
      if (parent && parent.leaderboard) return parent.leaderboard;
      return hexget(`/api/getmembers/${parent.guildId}`).then(
        (data) => data.leaderboard
      );
    },
    games: (parent: any, args: any) => {
      return hexget(
        `/api/games/bindings/guild/${parent.guildId}/game/${args.gameId}/list`
      );
    },
  },
};

export { rootResolver };
