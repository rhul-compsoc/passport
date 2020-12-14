import bodyParser from "body-parser";
import { TypeormStore } from "connect-typeorm/out";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import passport from "passport";
import { createConnection, getConnection } from "typeorm";
import { configuration } from "./config";
import { Session } from "./entity/Session";
import { User } from "./entity/User";
import { UserConnection } from "./entity/UserConnection";
import { discordStrategy } from "./passportStrategy/discordStrategy";
import { githubStrategy } from "./passportStrategy/githubStrategy";
import { microsoftStrategy } from "./passportStrategy/microsoftStrategy";
import { apiGuildRouter } from "./router/api/guild";
import { loginRouter } from "./router/login";

const app = express();

passport
  .use(microsoftStrategy)
  .use(discordStrategy)
  .use(githubStrategy);

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  getConnection()
    .getRepository(User)
    .findOne(id)
    .then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(
          new Error(
            "Failed to find a user in the database while deserialising!"
          )
        );
      }
    })
    .catch((err) => done(err));
});

const main = async () => {
  const connection = await createConnection({
    type: "sqlite",
    database: "data/data.db",
    entities: [User, UserConnection, Session],
  });

  await connection.synchronize();

  app
    .use(cookieParser(configuration.webserver.sessionSecret))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(
      session({
        resave: true,
        saveUninitialized: false,
        secret: configuration.webserver.sessionSecret,
        cookie: {
          secure: false,
          sameSite: 'none'
        },
        store: new TypeormStore().connect(connection.getRepository(Session)),
      })
    )
    .use((req, res, next) => {
      if (req.headers.origin) {
        try {
          const url = new URL(req.headers.origin);
  
          if (configuration.webserver.allowedOrigins.includes(url.host)) {
            res.header("Access-Control-Allow-Origin", req.headers.origin);
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Methods", "GET");
            res.header(
              "Access-Control-Allow-Headers",
              "Origin, Content-Type, Accept"
            );
          }
        } catch {}
      }

      if (typeof req.query.return === "string") {
        const url = new URL(req.query.return);

        if (configuration.webserver.allowedOrigins.includes(url.host)) {
          res.cookie("return", req.query.return);
        }
      }

      next();
    })
    .use(passport.initialize())
    .use(passport.session())
    .use("/login", loginRouter)
    .use("/api/guild", apiGuildRouter)
    .use((req, res, next) => {
      if (req.cookies.return) {
        res.cookie("return", "")
        res.redirect(req.cookies.return);
      } else {
        next();
      }
    })
    .use("*", (req, res) => {
      res.send("You have reached a 404 page.");
    })
    .listen(configuration.webserver.port);
};

main();
