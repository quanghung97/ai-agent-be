export interface SpeechPatterns {
  tone: string; // default: "neutral"
  vocabulary: string; // default: "standard"
  catchphrases: string[]; // default: []
}

export interface ResponseStyle {
  detail_level: string; // default: "balanced"
  emotional_expressiveness: string; // default: "moderate"
}

export interface BehavioralSettings {
  speech_patterns: SpeechPatterns;
  response_style: ResponseStyle;
}

export interface Appearance {
  height: string;
  build: string;
  hair: string;
  eyes: string;
  style: string;
  distinguishing_features: string[]; // default: []
}

export interface Background {
  origin: string;
  experiences: string[]; // default: []
  education?: string;
  occupation?: string;
}

export interface PersonalityTraits {
  friendliness: number; // 0.0 - 1.0
  humor: number; // 0.0 - 1.0
  formality: number; // 0.0 - 1.0
  creativity: number; // 0.0 - 1.0
  detail_oriented: number; // 0.0 - 1.0
}

export interface Personality {
  traits: PersonalityTraits;
  values: string[]; // default: []
  fears: string[]; // default: []
  motivations: string[]; // default: []
}

export interface WorldContext {
  setting: string; // default: "Cyberpunk dystopia, 2087"
  technology_level: string; // default: "Advanced AI, neural implants, quantum computing"
  social_structure: string; // default: "Corporate oligarchy, underground resistance"
}

export interface PersonalityConfig {
  name: string;
  gender: string;
  age: number; // must be >= 0
  personality: Personality;
  interests: string[]; // default: []
  communication_style: string;
  language: string; // default: "en"
  artistic_style: string;
  appearance: Appearance;
  background: Background;
  behavioral_settings: BehavioralSettings;
  world_context: WorldContext;
  knowledge_base: Record<string, string[]>; // default: {}

  generatePrompt(): string;
}

export class Agent implements PersonalityConfig {
  name: string;
  gender: string;
  age: number;
  personality: Personality;
  interests: string[];
  communication_style: string;
  language: string;
  artistic_style: string;
  appearance: Appearance;
  background: Background;
  behavioral_settings: BehavioralSettings;
  world_context: WorldContext;
  knowledge_base: Record<string, string[]>;

  constructor(config: PersonalityConfig) {
    Object.assign(this, config);
  }

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
6. If you are not completely sure, respond exactly with: i don't know (lowercase, no explanation).
7. Use your catchphrases naturally when appropriate

Remember: You are ${this.name} living in ${this.world_context.setting}. Never break character.`;
  }
}

