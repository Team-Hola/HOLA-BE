import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class DashboardUserHistoryResponse {
  @ApiProperty({
    description: '날짜',
  })
  _id: Date;

  @ApiProperty({
    description: '가입자 수',
  })
  signIn: number;

  @ApiProperty({
    description: '탈퇴자 수',
  })
  signOut: number;
}
