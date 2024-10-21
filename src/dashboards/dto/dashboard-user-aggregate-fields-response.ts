import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { UserPositionCode, UserWorkExperienceCode, userSkillCode, userStatusCode } from 'src/CommonCode';

export class DashboardUserAggregateFieldsResponse {
  @ApiProperty({
    enum: UserPositionCode,
    description: '사용자 포지션',
    example: 'BE',
  })
  position: string;

  @ApiProperty({
    enum: UserWorkExperienceCode,
    description: '경력',
    example: '1',
  })
  workExperience: string;

  @ApiProperty({
    enum: userSkillCode,
    isArray: true,
    description: '사용자 기술스택',
    example: '["java", "javascript"]',
  })
  likeLanguages: string[];

  @ApiProperty({ enum: userStatusCode, isArray: true, description: '유저 상태' })
  status: string[];
}
