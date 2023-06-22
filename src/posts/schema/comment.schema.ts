import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty({
    description: '작성자 ID',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, required: true })
  author: Types.ObjectId;

  @ApiProperty({
    description: '댓글 내용',
    example: '참여하고 싶습니다.',
  })
  @Prop({ type: String, required: true })
  content: string;

  @ApiProperty({
    type: Date,
    description: '생성일시',
  })
  @Prop()
  createdAt?: Date;

  @ApiProperty({
    type: Date,
    description: '수정일시',
  })
  @Prop()
  updatedAt?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
