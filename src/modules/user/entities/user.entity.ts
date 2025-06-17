import { BaseEntity } from 'src/common/entities/base.entity';
import {
  Entity,
  Column,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  appleId: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'oauth' })
  provider: string;
}
