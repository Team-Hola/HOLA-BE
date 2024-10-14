import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EventTypeCode } from 'src/CommonCode';
export class EventGetRecommendedCondition {
  @ApiProperty({
    enum: EventTypeCode,
    type: String,
    description: '공모전 구분(conference, hackathon, contest, bootcamp, others)',
    example: '1',
  })
  @IsEnum(EventTypeCode)
  @IsString()
  @IsOptional()
  eventType?: string;
}
