import { ApolloServer, gql } from "apollo-server-express";
import cookieParser from 'cookie-parser';
import express from "express";
import { configuration } from "./helpers/configuration";
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
    const user = unpack(req.cookies.token);

    if (user) {
      return {
        user,
        currentUser: await hexget(`/api/guild/500612695570120704/member/${user.id}/info`)
      }
    }

    return {
      user: null,
      currentUser: null,
    }
  }
});

const app = express();

app
  .use(cors)
  .use(cookieParser(configuration.secrets.cookies))
  .use('/login', loginRouter)

server.applyMiddleware({ app, cors: false });

app.listen(configuration.backend.port);
