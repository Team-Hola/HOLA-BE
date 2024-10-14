import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LikeEventDocument = HydratedDocument<LikeEvent>;

@Schema({ timestamps: true })
export class LikeEvent {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;
}

export const LikeEventSchema = SchemaFactory.createForClass(LikeEvent);
