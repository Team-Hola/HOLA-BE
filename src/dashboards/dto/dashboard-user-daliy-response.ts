import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class DashboardUserDaliyResponse {
  @ApiProperty({
    description: '총 유저',
  })
  totalUser: number;

  @ApiProperty({
    description: '오늘 회원 가입자 수',
  })
  signUp: number;

  @ApiProperty({
    description: '오늘 회원탈퇴 수',
  })
  signOut: number;
}
