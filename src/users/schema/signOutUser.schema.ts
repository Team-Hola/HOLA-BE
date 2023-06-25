import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SignOutUserDocument = HydratedDocument<SignOutUser>;

@Schema({ timestamps: true })
export class SignOutUser {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  idToken: string;

  @Prop({ type: String, required: true })
  tokenType: string;

  @Prop({ type: String, maxlength: 100 })
  nickName: string;

  @Prop({ type: String, minlength: 8 })
  password: string;

  @Prop()
  startDate: Date;

  @Prop()
  signOutDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: ' User' }] })
  userId: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const SignOutUserSchema = SchemaFactory.createForClass(SignOutUser);
