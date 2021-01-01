import { config } from "process";
import { configuration } from "../helpers/configuration";
import { hexdelete, hexget, hexpost } from "../helpers/hexapi";
import { isAllowedToUseArguments } from "../helpers/isValid";

const rootResolver = {
  Query: {
    user: (parent: any, args: any, context: any, info: any) => {
      return hexget(`/api/guild/${args.guildId}/member/${args.memberId}/info`);
    },
    guild: (parent: any, args: any, context: any, info: any) => {
      return hexget(`/api/getmembers/${args.guildId}`);
    },
    currentUser: (parent: any, args: any, context: any, info: any) => {
      return context.currentUser
    },
    currentGuilds: (parent: any, args: any, context: any, info: any) => {
      if (context.currentUser) {
        return [configuration.compsoc]
      } else {
        return []
      }
    }
  },
  Mutation: {
    createGameConnection: (parent: any, args: any, context: any, info: any) => {
      console.log(args, context)
      if (!isAllowedToUseArguments(args, context)) {
        throw new Error('You are not this user!')
      }
      return hexpost(`/api/games/bindings/create`, undefined, args.input)
    },
    deleteGameConnection: (parent: any, args: any, context: any, info: any) => {
      if (!isAllowedToUseArguments(args, context)) {
        throw new Error('You are not this user!')
      }
      return hexdelete(`/api/games/bindings/remove`, undefined, args.input)
    }
  },
  User: {
    games: (parent: any) => {
      return hexget(
        `/api/games/bindings/guild/${parent.guildId}/member/${parent.memberId}/list`
      );
    },
    studentVerified: (parent: any) => {
      if (parent && typeof parent.studentVerified === 'boolean') return parent.studentVerified;
      return hexget(`/api/guild/${parent.guildId}/member/${parent.memberId}/info`)
        .then((data) => data ? !!data.studentVerified : false)
    },
    guild: (parent: any) => {
      return hexget(`/api/getmembers/${parent.guildId}`);
    }
  },
  Guild: {
    users: (parent: any) => {
      if (parent && parent.leaderboard) return parent.leaderboard;
      return hexget(`/api/getmembers/${parent.guildId}`)
        .then((data) => data.leaderboard)
    },
    games: (parent: any, args: any) => {
      return hexget(`/api/games/bindings/guild/${parent.guildId}/game/${args.gameId}/list`);
    }
  }
}

export { rootResolver }
