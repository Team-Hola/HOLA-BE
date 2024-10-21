import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminLoginRequest {
  @ApiProperty({
    description: 'ID',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: '비밀번호',
  })
  @IsString()
  password: string;
}
