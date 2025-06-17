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

  @Column({ name: 'google_id', nullable: true, unique: true })
  googleId: string;

  @Column({ name: 'apple_id', nullable: true })
  appleId: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: 'oauth' })
  provider: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
