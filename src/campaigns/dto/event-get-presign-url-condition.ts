import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class EventGetPresignUrlCondition {
  @ApiProperty({
    type: String,
    description: '파일명칭',
    example: 'image.png',
  })
  @IsString()
  fileName?: string;
}
