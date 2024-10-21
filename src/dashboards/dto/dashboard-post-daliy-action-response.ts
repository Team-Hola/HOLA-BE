import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class DashboardPostDaliyActionResponse {
  @ApiProperty({
    description: '총 조회수',
  })
  totalView: number;

  @ApiProperty({
    description: '등록된 글',
  })
  created: number;

  @ApiProperty({
    description: '마감된 글',
  })
  closed: number;

  @ApiProperty({
    description: '삭제된 글',
  })
  deleted: number;
}
