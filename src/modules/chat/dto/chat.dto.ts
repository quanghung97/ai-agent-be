import { ApiProperty } from '@nestjs/swagger';

export class VoiceSettingsDto {
  @ApiProperty({
    description: 'Voice stability (0.0-1.0)',
    example: 0.5,
  })
  stability: number;

  @ApiProperty({
    description: 'Voice similarity boost (0.0-1.0)',
    example: 0.5,
  })
  similarity_boost: number;

  @ApiProperty({
    description: 'Voice style (0.0-1.0)',
    example: 0.0,
  })
  style: number;

  @ApiProperty({
    description: 'Use speaker boost',
    example: true,
  })
  use_speaker_boost: boolean;

  @ApiProperty({
    description: 'Voice speed',
    example: 1.0,
  })
  speed: number;
}

export class TTSSettingsDto {
  @ApiProperty({
    description: 'Enable text-to-speech',
    example: true,
  })
  enable_tts: boolean;

  @ApiProperty({
    description: 'Voice ID',
    example: '21m00Tcm4TlvDq8ikWAM',
  })
  voice_id: string;

  @ApiProperty({
    description: 'Voice settings',
    type: VoiceSettingsDto,
  })
  voice_settings: VoiceSettingsDto;
}

export class ChatRequestDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: 'user-123',
  })
  user_id: string;

  @ApiProperty({
    description: 'The message content',
    example: 'Hello, how are you?',
  })
  message: string;

  @ApiProperty({
    description: 'The session ID',
    example: 'session-456',
    required: false,
  })
  session_id: string;

  @ApiProperty({
    description: 'The agent ID',
    example: 'agent-789',
    required: true,
  })
  agent_id: string;

  @ApiProperty({
    description: 'Additional context for the message',
    example: { language: 'en', timezone: 'UTC' },
    required: false,
  })
  context: Record<string, any>;

  @ApiProperty({
    description: 'Text-to-speech settings',
    type: TTSSettingsDto,
    required: false,
  })
  tts_settings?: TTSSettingsDto;
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'The response message',
    example: 'Hello! How can I help you today?',
  })
  response: string;

  @ApiProperty({
    description: 'The session ID',
    example: 'session-456',
  })
  session_id: string;

  @ApiProperty({
    description: 'The user ID',
    example: 'user-123',
  })
  user_id: string;

  @ApiProperty({
    description: 'The type of response',
    example: 'text',
  })
  type: string;

  @ApiProperty({
    description: 'Message metadata',
    example: { timestamp: '2023-10-01T12:00:00Z' },
  })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Audio content in bytes',
    format: 'binary',
    required: false,
  })
  audio_content?: Uint8Array | string;
}
