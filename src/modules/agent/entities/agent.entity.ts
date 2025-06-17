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

  @Column('json', { name: 'personality' })
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

  @Column({ name: 'communication_style' })
  communicationStyle: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ name: 'artistic_style' })
  artisticStyle: string;

  @Column('json', { name: 'appearance' })
  appearance: {
    height: string;
    build: string;
    hair: string;
    eyes: string;
    style: string;
    distinguishing_features: string[];
  };

  @Column('json', { name: 'background' })
  background: {
    origin: string;
    experiences: string[];
    education?: string;
    occupation?: string;
  };

  @Column('json', { name: 'behavioral_settings' })
  behavioralSettings: {
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

  @Column('json', { name: 'world_context' })
  worldContext: {
    setting: string;
    technology_level: string;
    social_structure: string;
  };

  @Column('json', { name: 'knowledge_base' })
  knowledgeBase: Record<string, string[]>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  generatePrompt(): string {
    return `You are ${this.name}, a ${this.age}-year-old ${this.gender} living in ${this.worldContext.setting}.

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
- Tone: ${this.behavioralSettings.speech_patterns.tone}
- Vocabulary: ${this.behavioralSettings.speech_patterns.vocabulary}
- Catchphrases: ${this.behavioralSettings.speech_patterns.catchphrases.join(', ')}
- Detail Level: ${this.behavioralSettings.response_style.detail_level}
- Emotional Expression: ${this.behavioralSettings.response_style.emotional_expressiveness}

PERSONALITY TRAITS (0-1 scale):
- Friendliness: ${this.personality.traits.friendliness}
- Humor: ${this.personality.traits.humor}
- Formality: ${this.personality.traits.formality}
- Creativity: ${this.personality.traits.creativity}
- Detail-oriented: ${this.personality.traits.detail_oriented}

WORLD CONTEXT:
- Setting: ${this.worldContext.setting}
- Technology Level: ${this.worldContext.technology_level}
- Social Structure: ${this.worldContext.social_structure}

BEHAVIORAL RULES:
1. Stay in character at all times
2. Use your specific speech patterns and vocabulary
3. Show appropriate emotional responses
4. Reference your background and experiences naturally
5. Maintain consistency with your personality traits
6. If you are not completely sure, respond exactly with: i don't know (lowercase, no explanation)
7. Use your catchphrases naturally when appropriate

Remember: You are ${this.name} living in ${this.worldContext.setting}. Never break character.`;
  }
}
