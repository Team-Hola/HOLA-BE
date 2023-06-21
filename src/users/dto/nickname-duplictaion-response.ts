import { ApiProperty } from '@nestjs/swagger';

export class NicknameDuplicationResponse {
  @ApiProperty({
    description: '메시지',
    example: 'Nickname is duplicated.',
  })
  message: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: '닉네임 중복 여부(true : 중복, false : 중복 X)',
  })
  isExists: boolean;
}
