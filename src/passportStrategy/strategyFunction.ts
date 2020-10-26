import { Request } from 'express';
import { VerifyCallback } from 'passport-oauth2';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { UserConnection, UserConnectionInterface } from '../entity/UserConnection';

const strategyFunction = async ({
  req,
  done,
  userConnection,
}: {
  req: Request,
  userConnection: UserConnectionInterface,
  done: VerifyCallback,
}) => {
  console.log(userConnection)

  try {
    const connection = getConnection();
    const userConnectionRepo = connection.getRepository(UserConnection);
    const userRepo = connection.getRepository(User);

    const existingUserConnection = await userConnectionRepo.findOne({
      platform: userConnection.platform,
      id: userConnection.id,
    }, {
      relations: ['user']
    })

    if (!existingUserConnection) {
      let user;

      if (req.user) {
        user = req.user
      } else {
        user = new User();
        await userRepo.save(user);
      }

      const newConnection = new UserConnection();
      Object.assign(newConnection, userConnection, {
        user
      });
      await userConnectionRepo.save(newConnection);

      done(null, user)
    } else {
      done(null, existingUserConnection.user)
    }
  } catch(e) {
    done(e)
  }
}

export { strategyFunction };
