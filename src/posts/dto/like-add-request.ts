import { Transform } from 'class-transformer';
import { Types } from 'mongoose';
import { toMongoObjectId } from 'src/common/cast.helper';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LikeAddRequest {
  @ApiProperty({
    description: '글 ID',
    example: '619fa9b2e08659622c654395',
    required: true,
  })
  @Transform(toMongoObjectId)
  @IsNotEmpty()
  postId: Types.ObjectId;
}
