import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';

@Entity('voices')
export class Voice extends BaseEntity {
  @Column()
  name: string;

  @Column('text', { array: true })
  languages: string[]; // e.g. {en,fr,vn}

  @Column({ name: 'short_description', type: 'varchar', length: 255 })
  shortDescription: string;

  @Column({ name: 'long_description', type: 'text' })
  longDescription: string;

  @Column({ name: 'voice_id', unique: true })
  voiceId: string; // From ElevenLabs Voice ID

  @Column({ type: 'float', default: 1 })
  speed: number; // 0.7 - 1.2

  @Column({ type: 'float', default: 0.8 })
  stability: number; // 0.0 - 1.0

  @Column({ type: 'float', default: 0.9 })
  similarity: number; // 0.0 - 1.0
}
