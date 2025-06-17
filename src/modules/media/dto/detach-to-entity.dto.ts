import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DetachToEntityDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  mediaId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  imageableId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'validation.IsNotEmpty' })
  imageableType: string;
}
