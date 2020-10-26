// https://github.com/nykula/connect-typeorm
// Not sure why we can't just import it from their's, but okay.

import { ISession } from 'connect-typeorm';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
class Session implements ISession {
  @Index()
  @Column("bigint")
  expiredAt: number = Date.now();

  @PrimaryColumn("varchar", { length: 255 })
  id: string = '';

  @Column("text")
  json: string = '';
}

export { Session };

