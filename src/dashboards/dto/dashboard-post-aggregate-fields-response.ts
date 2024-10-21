import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import {
  PostExpectedPeriodCode,
  PostLanguageCode,
  PostOnlineOrOfflineCode,
  PostPositionsCode,
  PostTypeCode,
  UserPositionCode,
  UserWorkExperienceCode,
  userSkillCode,
  userStatusCode,
} from 'src/CommonCode';

export class DashboardPostAggregateFieldsResponse {
  @ApiProperty({
    enum: PostTypeCode,
    type: String,
    description: '모집구분(1: 프로젝트, 2: 스터디)',
    example: '1',
  })
  type: string;

  @ApiProperty({
    enum: PostLanguageCode,
    isArray: true,
    description: '사용언어',
    example: '["java", "javascript"]',
  })
  language: string[];

  @ApiProperty({
    enum: PostOnlineOrOfflineCode,
    enumName: 'PostOnlineOrOfflineCode',
    description: '온, 오프라인 구분(on, off, onOff)',
    example: 'on',
  })
  onlineOrOffline: string;

  @ApiProperty({
    enum: PostExpectedPeriodCode,
    enumName: 'PostExpectedPeriodCode',
    description: '예상진행기간(und, 1, 2, 3)',
    example: '3',
  })
  expectedPeriod: string;

  @ApiProperty({
    enum: PostPositionsCode,
    type: String,
    description: '포지션(FE, BE, DE)',
    example: '["FE", "BE"]',
  })
  positions: string[];
}
