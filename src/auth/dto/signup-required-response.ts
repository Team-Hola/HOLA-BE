import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class SignupRequiredResponse {
  @ApiProperty({
    description: '로그인 성공 여부',
    type: Boolean,
    example: 'false',
  })
  loginSuccess: false;

  @ApiProperty({
    description: '사용자 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '회원가입 필요 여부(true : 회원가입 필요, false : 회원가입 불필요)',
    type: Boolean,
    example: 'true',
  })
  SignupRequiredResponse: boolean;

  @ApiProperty({
    description: '메시지',
    example: '회원 가입을 진행해야 합니다.',
  })
  message: string;
}
