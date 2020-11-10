import { Strategy } from "passport-discord";
import { configuration } from "../config";
import { UserConnectionPlatform } from "../enum/UserConnectionPlatform";
import { strategyFunction } from "./strategyFunction";

const discordStrategy = new Strategy(
  {
    clientID: configuration.secrets.discord.clientID,
    clientSecret: configuration.secrets.discord.clientSecret,
    callbackURL: configuration.location.origin + "/login/" + UserConnectionPlatform.DISCORD + "/return",
    scope: ["identify"],
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    strategyFunction({
      req,
      done,
      userConnection: {
        id: profile.id,
        platform: UserConnectionPlatform.DISCORD,
        username: profile.username,
        discriminator: profile.discriminator,
      },
    });
  }
);

export { discordStrategy };
