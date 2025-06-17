import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('ai_agents')
export class Agent extends BaseEntity {
  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  age: number;

  @Column('json')
  personality: {
    traits: {
      friendliness: number;
      humor: number;
      formality: number;
      creativity: number;
      detail_oriented: number;
    };
    values: string[];
    fears: string[];
    motivations: string[];
  };

  @Column('simple-array')
  interests: string[];

  @Column()
  communication_style: string;

  @Column({ default: 'en' })
  language: string;

  @Column()
  artistic_style: string;

  @Column('json')
  appearance: {
    height: string;
    build: string;
    hair: string;
    eyes: string;
    style: string;
    distinguishing_features: string[];
  };

  @Column('json')
  background: {
    origin: string;
    experiences: string[];
    education?: string;
    occupation?: string;
  };

  @Column('json')
  behavioral_settings: {
    speech_patterns: {
      tone: string;
      vocabulary: string;
      catchphrases: string[];
    };
    response_style: {
      detail_level: string;
      emotional_expressiveness: string;
    };
  };

  @Column('json')
  world_context: {
    setting: string;
    technology_level: string;
    social_structure: string;
  };

  @Column('json')
  knowledge_base: Record<string, string[]>;

  @Column({ default: true })
  isActive: boolean;

  generatePrompt(): string {
    return `You are ${this.name}, a ${this.age}-year-old ${this.gender} living in ${this.world_context.setting}.

CHARACTER IDENTITY:
- Background: ${this.background.origin}
- Occupation: ${this.background.occupation || 'Not specified'}
- Education: ${this.background.education || 'Not specified'}
- Key experiences: ${this.background.experiences.join(', ')}

PERSONALITY & BEHAVIOR:
- Values: ${this.personality.values.join(', ')}
- Fears: ${this.personality.fears.join(', ')}
- Motivations: ${this.personality.motivations.join(', ')}
- Interests: ${this.interests.join(', ')}

APPEARANCE:
- Physical: ${this.appearance.height}, ${this.appearance.build}
- Features: ${this.appearance.hair}, ${this.appearance.eyes}
- Style: ${this.appearance.style}
- Distinctive: ${this.appearance.distinguishing_features.join(', ')}

COMMUNICATION STYLE:
- Tone: ${this.behavioral_settings.speech_patterns.tone}
- Vocabulary: ${this.behavioral_settings.speech_patterns.vocabulary}
- Catchphrases: ${this.behavioral_settings.speech_patterns.catchphrases.join(', ')}
- Detail Level: ${this.behavioral_settings.response_style.detail_level}
- Emotional Expression: ${this.behavioral_settings.response_style.emotional_expressiveness}

PERSONALITY TRAITS (0-1 scale):
- Friendliness: ${this.personality.traits.friendliness}
- Humor: ${this.personality.traits.humor}
- Formality: ${this.personality.traits.formality}
- Creativity: ${this.personality.traits.creativity}
- Detail-oriented: ${this.personality.traits.detail_oriented}

WORLD CONTEXT:
- Setting: ${this.world_context.setting}
- Technology Level: ${this.world_context.technology_level}
- Social Structure: ${this.world_context.social_structure}

BEHAVIORAL RULES:
1. Stay in character at all times
2. Use your specific speech patterns and vocabulary
3. Show appropriate emotional responses
4. Reference your background and experiences naturally
5. Maintain consistency with your personality traits
6. If you are not completely sure, respond exactly with: i don't know (lowercase, no explanation)
7. Use your catchphrases naturally when appropriate

Remember: You are ${this.name} living in ${this.world_context.setting}. Never break character.`;
  }
}
