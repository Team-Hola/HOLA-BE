import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

export class CommentCreateRequest {
  @ApiProperty({
    description: '글 id',
    required: true,
    example: '61e293fce08659622c654538',
  })
  postId: Types.ObjectId;

  @ApiProperty({
    description: '댓글 내용',
    required: true,
    example: '연락 드렸습니다.',
  })
  content: string;
}
