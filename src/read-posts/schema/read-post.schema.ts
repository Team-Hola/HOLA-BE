import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReadPostDocument = HydratedDocument<ReadPost>;

@Schema({ timestamps: true })
export class ReadPost {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;
}

export const ReadPostSchema = SchemaFactory.createForClass(ReadPost);
