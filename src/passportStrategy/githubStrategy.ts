import { Strategy } from "passport-github";
import { configuration } from "../config";
import { UserConnectionPlatform } from "../enum/UserConnectionPlatform";
import { strategyFunction } from "./strategyFunction";

const githubStrategy = new Strategy(
  {
    clientID: configuration.secrets.github.clientID,
    clientSecret: configuration.secrets.github.clientSecret,
    callbackURL: configuration.location.origin + "/login/github/return",
    passReqToCallback: true,
  },
  (req, accessToken, refreshToken, profile, done) => {
    if (!profile.username)
      return done(new Error("Could not find GitHub username"));

    strategyFunction({
      req,
      done,
      userConnection: {
        id: profile.id,
        platform: UserConnectionPlatform.GITHUB,
        username: profile.username,
        displayName: profile.displayName,
      },
    });
  }
);

export { githubStrategy };
