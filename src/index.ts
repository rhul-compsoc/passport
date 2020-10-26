import bodyParser from 'body-parser';
import { TypeormStore } from 'connect-typeorm/out';
import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { createConnection, getConnection } from 'typeorm';
import { configuration } from './config';
import { Session } from './entity/Session';
import { User } from './entity/User';
import { UserConnection } from './entity/UserConnection';
import { discordStrategy } from './passportStrategy/discordStrategy';
import { githubStrategy } from './passportStrategy/githubStrategy';
import { loginRouter } from './router/login';

const app = express();

passport.serializeUser((user: User, done) => {
  console.log(user)
  done(null, user.id);
})

passport.deserializeUser((id: string, done) => {
  getConnection().getRepository(User).findOne(id)
    .then((user) => {
      if (user) {
        done(null, user)
      } else {
        done(new Error('Failed to find a user in the database while deserialising!'));
      }
    })
    .catch(err => done(err))
})

const main = async () => {
  const connection = await createConnection({
    type: 'sqlite',
    database: 'data/data.db',
    entities: [
      User,
      UserConnection,
      Session,
    ]
  })

  await connection.synchronize();

  passport
    // .use(microsoftStrategy)
    .use(discordStrategy)
    .use(githubStrategy)

  app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(session({
      resave: true,
      saveUninitialized: false,
      secret: configuration.webserver.sessionSecret,
      cookie: {
        secure: 'auto',
        sameSite: 'none',
      },
      store: new TypeormStore().connect(connection.getRepository(Session))
    }))
    .use(passport.initialize())
    .use(passport.session())
    .use('/login', loginRouter)
    .get('/', (req: Request, res: Response) => {
      res.send('You are on the Home page.')
    })
    .use('*', (req, res) => {
      res.send('You have reached a 404 page.');
    })
    .listen(configuration.webserver.port);
}

main();
