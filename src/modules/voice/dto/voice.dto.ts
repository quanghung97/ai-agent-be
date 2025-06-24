import { ApiProperty } from '@nestjs/swagger';

export class CreateVoiceDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: [String] })
  languages: string[];

  @ApiProperty()
  shortDescription: string;

  @ApiProperty()
  longDescription: string;

  @ApiProperty()
  voiceId: string;

  @ApiProperty({ minimum: 0.7, maximum: 1.2, default: 1, required: false })
  speed?: number;

  @ApiProperty({ minimum: 0.0, maximum: 1.0, default: 0.8, required: false })
  stability?: number;

  @ApiProperty({ minimum: 0.0, maximum: 1.0, default: 0.9, required: false })
  similarity?: number;
}

export class UpdateVoiceDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ type: [String], required: false })
  languages?: string[];

  @ApiProperty({ required: false })
  shortDescription?: string;

  @ApiProperty({ required: false })
  longDescription?: string;

  @ApiProperty({ required: false })
  voiceId?: string;

  @ApiProperty({ minimum: 0.7, maximum: 1.2, required: false })
  speed?: number;

  @ApiProperty({ minimum: 0.0, maximum: 1.0, required: false })
  stability?: number;

  @ApiProperty({ minimum: 0.0, maximum: 1.0, required: false })
  similarity?: number;
}
