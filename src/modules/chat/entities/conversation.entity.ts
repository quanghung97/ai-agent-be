import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { Agent } from '@agent/entities/agent.entity';
import { User } from '@user/entities/user.entity';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ name: 'session_id' })
  sessionId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'agent_id' })
  agentId: string;

  @Column('text')
  message: string;

  @Column('text')
  response: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'audio_url', nullable: true })
  audioUrl?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Agent)
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;
}
