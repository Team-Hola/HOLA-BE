import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @ApiProperty({
    description: '알림 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '알림 종류',
    example: 'comment',
  })
  @Prop({ type: String, required: true })
  noticeType: string;

  @ApiProperty({
    description: '알림 대상자',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  targetUserId: Types.ObjectId;

  @ApiProperty({
    description: '제목',
    example: '자바둘 님이 댓글을 남겼어요: 참여할래요!',
  })
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty({
    description: '하이퍼링크(클릭 시 이동)',
    example: 'http://localhost:3000/study/64be012194b3593f58bffcff',
  })
  @Prop({ type: String, required: true })
  href: string;

  @ApiProperty({
    description: '버튼 명',
    example: '확인하기',
  })
  @Prop({ type: String, required: true })
  buttonLabel: string;

  @ApiProperty({
    description: '아이콘',
    example: '💬',
  })
  @Prop({ type: String, required: true })
  icon: string;

  @ApiProperty({
    type: Boolean,
    description: '읽음 여부',
    example: 'false',
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({
    type: Date,
    description: '읽은날짜',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  readDate: Date;

  @ApiProperty({
    description: '알림 생성자',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  createUserId: Types.ObjectId;

  @ApiProperty({
    description: '알림 대상 Object',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, required: false })
  createObjectId: Types.ObjectId;

  @ApiProperty({
    description: '알림 발생 대상의 부모 Object(부모 Object 삭제 시 알림 제거용)',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, required: false })
  parentObjectId: Types.ObjectId;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
