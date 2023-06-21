import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class SignupSuccessResponse {
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
    description: '엑세스 토큰',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
  })
  refreshToken: string;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: '닉네임 중복 여부(true : 중복, false : 중복 X)',
  })
  isExists: boolean;
}
