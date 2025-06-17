import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsArray, IsObject, IsBoolean, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PersonalityTraitsDto {
  @IsNumber()
  @Min(0)
  friendliness: number;

  @IsNumber()
  @Min(0)
  humor: number;

  @IsNumber()
  @Min(0)
  formality: number;

  @IsNumber()
  @Min(0)
  creativity: number;

  @IsNumber()
  @Min(0)
  detail_oriented: number;
}

class PersonalityDto {
  @ValidateNested()
  @Type(() => PersonalityTraitsDto)
  traits: PersonalityTraitsDto;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  values: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  fears: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  motivations: string[];
}

class AppearanceDto {
  @ApiProperty()
  @IsString()
  height: string;

  @ApiProperty()
  @IsString()
  build: string;

  @ApiProperty()
  @IsString()
  hair: string;

  @ApiProperty()
  @IsString()
  eyes: string;

  @ApiProperty()
  @IsString()
  style: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  distinguishing_features: string[];
}

class BackgroundDto {
  @ApiProperty()
  @IsString()
  origin: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  experiences: string[];

  @ApiProperty()
  @IsString()
  education?: string;

  @ApiProperty()
  @IsString()
  occupation?: string;
}

class SpeechPatternsDto {
  @ApiProperty()
  @IsString()
  tone: string;

  @ApiProperty()
  @IsString()
  vocabulary: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  catchphrases: string[];
}

class ResponseStyleDto {
  @ApiProperty()
  @IsString()
  detail_level: string;

  @ApiProperty()
  @IsString()
  emotional_expressiveness: string;
}

class BehavioralSettingsDto {
  @ApiProperty({ type: SpeechPatternsDto })
  @ValidateNested()
  @Type(() => SpeechPatternsDto)
  speech_patterns: SpeechPatternsDto;

  @ApiProperty({ type: ResponseStyleDto })
  @ValidateNested()
  @Type(() => ResponseStyleDto)
  response_style: ResponseStyleDto;
}

class WorldContextDto {
  @ApiProperty()
  @IsString()
  setting: string;

  @ApiProperty()
  @IsString()
  technology_level: string;

  @ApiProperty()
  @IsString()
  social_structure: string;
}

export class CreateAgentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  gender: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  age: number;

  @ApiProperty({ type: PersonalityDto })
  @ValidateNested()
  @Type(() => PersonalityDto)
  personality: PersonalityDto;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @ApiProperty()
  @IsString()
  communication_style: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  artistic_style: string;

  @ApiProperty({ type: AppearanceDto })
  @ValidateNested()
  @Type(() => AppearanceDto)
  appearance: AppearanceDto;

  @ApiProperty({ type: BackgroundDto })
  @ValidateNested()
  @Type(() => BackgroundDto)
  background: BackgroundDto;

  @ApiProperty({ type: BehavioralSettingsDto })
  @ValidateNested()
  @Type(() => BehavioralSettingsDto)
  behavioral_settings: BehavioralSettingsDto;

  @ApiProperty({ type: WorldContextDto })
  @ValidateNested()
  @Type(() => WorldContextDto)
  world_context: WorldContextDto;

  @ApiProperty()
  @IsObject()
  knowledge_base: Record<string, string[]>;
}

export class UpdateAgentDto extends CreateAgentDto {}
