import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { UserConnectionPlatform } from "../enum/UserConnectionPlatform";
import { User } from "./User";

interface UserConnectionInterface {
  platform: UserConnectionPlatform;
  id: string;
  email?: string;
  username: string;
  displayName?: string;
  discriminator?: string;
}

@Entity()
class UserConnection implements UserConnectionInterface {
  @PrimaryColumn({
    enum: UserConnectionPlatform
  })
  platform!: UserConnectionPlatform;

  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User, user => user.connections)
  user!: User;

  @Column({ nullable: true })
  email?: string;

  @Column()
  username!: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ nullable: true })
  discriminator?: string;
}

export { UserConnection, UserConnectionInterface };
