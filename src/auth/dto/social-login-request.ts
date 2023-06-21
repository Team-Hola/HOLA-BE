import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialLoginRequest {
  @ApiProperty({
    description: '로그인 타입(github, google, kakao)',
    example: 'google',
  })
  @IsString()
  loginType: string;

  @ApiProperty({
    description: 'Oauth id token',
    example: '106469319468949472569',
  })
  @IsString()
  code: string;
}
