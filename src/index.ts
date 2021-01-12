import { ApolloServer, AuthenticationError, gql } from "apollo-server-express";
import cookieParser from "cookie-parser";
import express, { NextFunction, Request, Response } from "express";
import { configuration } from "./helpers/configuration";
import { InvalidTokenException, LoginException } from "./helpers/exceptions";
import { hexget } from "./helpers/hexapi";
import { unpack } from "./helpers/jwt";
import { cors } from "./middleware/cors";
import { rootResolver } from "./resolvers/root";
import { loginRouter } from "./routers/login";

const typeDefs = gql`
  type User {
    guildId: ID!
    memberId: ID!
    booleanScore: Int
    numMessages: Int
    username: String
    nickname: String
    discrim: String
    studentVerified: Boolean
    avatarUrl: String
    xpTotal: Int
    games: [Game!]
    guild: Guild
  }

  input GameCreationInput {
    guildId: ID!
    gameId: ID!
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
    gameUserId: ID!
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
    gameTypes: [String!]
    currentUser: User
    currentGuilds: [Guild!]
    user(memberId: ID!, guildId: ID!): User
    guild(guildId: ID!): Guild
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers: rootResolver,
  introspection: true,
  playground: true,
  context: async ({ req }) => {
    if (!req.cookies.token) throw new AuthenticationError('You are not signed in yet!')

    const user = unpack(req.cookies.token);

    console.log('Remote Address: ', req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    if (user) {
      return {
        user,
        currentUser: await hexget(
          `/api/guild/500612695570120704/member/${user.id}/info`
        ),
      };
    }

    throw new AuthenticationError('You are not signed in yet!');
  },
});

const app = express();

app
  .use(cors)
  .use(cookieParser(configuration.secrets.cookies))
  .use("/login", loginRouter)
  .use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof LoginException) {
      res.status(401)
    } else if (err instanceof InvalidTokenException) {
      res.status(403)
    } else {
      res.status(500)
    }

    res.send(err)
  })

server.applyMiddleware({ app, cors: false });

app.listen(configuration.backend.port);
