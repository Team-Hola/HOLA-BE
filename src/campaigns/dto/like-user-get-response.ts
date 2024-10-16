import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class LikeUserGetResponse {
  @ApiProperty({
    type: 'Array',
    example: ['6107a55372182bfb2315008d', '6107a55372182bfb2315008d'],
    description: '관심 등록한 사용자 리스트',
  })
  likeUsers: [Types.ObjectId];
}
