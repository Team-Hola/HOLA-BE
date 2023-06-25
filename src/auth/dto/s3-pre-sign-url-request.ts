import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class S3PreSignUrlRequestDto {
  @ApiProperty({
    description: '파일명',
    example: 'image.png',
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
