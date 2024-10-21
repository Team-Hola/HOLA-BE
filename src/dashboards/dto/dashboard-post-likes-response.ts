import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class DashboardPostLikesResponse {
  @ApiProperty({
    description: '전체 좋아요 수',
  })
  totalLikes: number;

  @ApiProperty({
    description: '전체 유저 수',
  })
  totalUsers: number;

  @ApiProperty({
    description: '유저당 평균 좋아요 수',
  })
  average: number;
}
