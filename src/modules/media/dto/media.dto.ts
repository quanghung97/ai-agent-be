import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MediaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  @IsUUID('all', { message: 'validation.IsUUID' })
  mediaId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  zone: string;
}
