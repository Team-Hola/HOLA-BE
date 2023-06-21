import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class LoginSuccessResponse {
  @ApiProperty({
    description: '로그인 성공 여부',
    type: Boolean,
    example: 'false',
  })
  loginSuccess: true;

  @ApiProperty({
    description: '사용자 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '닉네임',
    example: 'Hola!',
  })
  nickName: string;

  @ApiProperty({
    description: '이미지 명',
    example: 'default.PNG',
  })
  image: string;

  @ApiProperty({
    type: [String],
    description: '관심 기술스택',
    example: '["java", "javascript"]',
    required: false,
  })
  likeLanguages: string[];

  @ApiProperty({
    description: '엑세스 토큰',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
  })
  refreshToken: string;

  @ApiProperty({
    description: '읽지 않은 알림 존재 여부',
    type: Boolean,
    example: 'false',
  })
  hasUnreadNotice: boolean;
}
