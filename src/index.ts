import { ApolloServer, gql } from "apollo-server-express";
import express, { NextFunction, Request, Response } from "express";
import { hexdelete, hexget, hexpost } from "./helpers/hexapi";
import jwt from "jsonwebtoken";
import { configuration } from "./helpers/configuration";
import cookieParser from 'cookie-parser';
import { loginRouter } from "./routers/login";
import { unpack } from "./helpers/jwt";
import { cors } from "./middleware/cors";

const typeDefs = gql`
  type User {
    guildId: ID!
    memberId: ID!
    username: String
    nickname: String
    studentVerified: Boolean
    avatarUrl: String
    xpTotal: Int
    games: [Game!]
    guild: Guild
  }

  input GameCreationInput {
    guildId: ID!
    gameId: ID!
    gameUserId: ID!
    gameUsername: ID
    memberId: ID!
    userBanned: Boolean
  }

  input GameDeletionInput {
    memberId: ID!
    bindingId: Int!
  }

  type Game {
    bindingId: Int!
    gameId: ID!
    gameUsername: String
    gameUserId: ID
    memberId: ID!
    userBanned: Boolean
  }

  type Guild {
    guildId: ID!
    avatarUrl: String
    guildName: String
    users: [User!]
    games(gameId: ID!): [Game!]
  }

  type Mutation {
    createGameConnection(input: GameCreationInput!): Game
    deleteGameConnection(input: GameDeletionInput!): Game
  }

  type Query {
    user(memberId: ID, guildId: ID!): User
    guild(guildId: ID!): Guild
  }
`;

const resolvers = {
  Query: {
    user: (parent: any, args: any, context: any, info: any) => {
      return hexget(`/api/guild/${args.guildId}/member/${args.memberId || context.user?.id }/info`);
    },
    guild: (parent: any, args: any, context: any, info: any) => {
      return hexget(`/api/getmembers/${args.guildId}`);
    }
  },
  Mutation: {
    createGameConnection: (parent: any, args: any) => {
      return hexpost(`/api/games/bindings/create`, undefined, args.input)
    },
    deleteGameConnection: (parent: any, args: any) => {
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
      return parent.leaderboard
    },
    games: (parent: any, args: any) => {
      return hexget(`/api/games/bindings/guild/${parent.guildId}/game/${args.gameId}/list`);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
  context: ({ req }) => {
    return {
      user: unpack(req.cookies.token)
    }
  }
});

const app = express();

app
  .use(cors)
  .use(cookieParser(configuration.secrets.cookies))
  .use('/login', loginRouter)

server.applyMiddleware({ app, cors: false });

app.listen(3000);
