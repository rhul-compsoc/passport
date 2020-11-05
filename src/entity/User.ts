import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserConnection } from "./UserConnection";

@Entity()
class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => UserConnection, (userConnection) => userConnection.user, {
    eager: true,
  })
  connections!: UserConnection[];
}

export { User };
