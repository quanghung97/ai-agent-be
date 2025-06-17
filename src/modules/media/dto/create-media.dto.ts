import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  isFolder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('all', { message: 'validation.IsUUID' })
  folderId?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  fileName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  filePath: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  fileUrl: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  extension: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  mimeType: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsNumber({}, { message: 'validation.IsNumber' })
  fileSize: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('all', { message: 'validation.IsUUID' })
  createdBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('all', { message: 'validation.IsUUID' })
  updatedBy?: string;
}
