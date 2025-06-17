import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AttachToEntityDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsUUID('all', { message: 'validation.IsUUID' })
  mediaId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsUUID('all', { message: 'validation.IsUUID' })
  imageableId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  imageableType: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  zone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'validation.IsNumber' })
  order?: number;
}
