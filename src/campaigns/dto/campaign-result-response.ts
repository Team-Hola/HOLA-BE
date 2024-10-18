import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CampaignResultResponse {
  @ApiProperty({
    type: String,
    example: 'banner',
    description: '광고 유형(banner, event)',
  })
  advertisementType: String;

  @ApiProperty({
    type: String,
    example: '6513fd110c19093e9896c9a2',
    description: '광고 ID',
  })
  advertisementId: Types.ObjectId;

  @ApiProperty({
    type: Number,
    example: 500,
    description: '노출 수',
  })
  impression: number;
  @ApiProperty({
    type: Number,
    example: 50,
    description: '클릭 수',
  })
  reach: number;
  @ApiProperty({
    type: String,
    example: '10%',
    description: '클릭률(%)',
  })
  reachRate: String;
}
