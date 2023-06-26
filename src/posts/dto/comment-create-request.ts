import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, isString } from 'class-validator';
import { Types } from 'mongoose';
import { toMongoObjectId } from 'src/common/cast.helper';

export class CommentCreateRequest {
  @ApiProperty({
    description: '글 id',
    required: true,
    example: '61e293fce08659622c654538',
  })
  @Transform(toMongoObjectId)
  postId: Types.ObjectId;

  @ApiProperty({
    description: '댓글 내용',
    required: true,
    example: '참여하고 싶습니다!',
  })
  @IsString()
  content: string;
}
