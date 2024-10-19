import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { NotificationCode } from 'src/CommonCode';
export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @ApiProperty({
    description: '알림 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '알림 제목',
    required: true,
    example: 'Hola! 알림',
  })
  @Prop({ type: String, required: true })
  @IsString()
  title: string;

  @ApiProperty({
    description: '알림 내용',
    required: false,
    example: '내용입니다!',
  })
  @Prop({ type: String, required: false, default: '' })
  @IsString()
  content: string;

  @ApiProperty({
    type: Boolean,
    description: '읽음 여부',
    example: 'false',
    required: true,
    default: false,
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  isRead: boolean;

  @ApiProperty({
    description: '알림 대상자 USER .ID',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  targetUserId: Types.ObjectId;

  @ApiProperty({
    description: '생성자 USER ID',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createUserId: Types.ObjectId;

  @ApiProperty({
    description: '알림이 생성된 Object ID',
    example: '619fa9b2e08659622c654395',
  })
  createObjectId: Types.ObjectId;

  @ApiProperty({
    description: '알림 클릭 시 이동 링크',
    required: true,
    example: 'https://holaworld.io',
  })
  @Prop({ type: String, required: true })
  @IsString()
  href: string;

  @ApiProperty({
    type: Date,
    description: '읽은 시간',
  })
  @Prop()
  readDate?: Date;

  @ApiProperty({
    enum: NotificationCode,
    type: String,
    description: '알림 유형(comment: 댓글 등록 알림, signup: 회원 가입 알림)',
    example: 'comment',
  })
  @Prop()
  @IsEnum(NotificationCode)
  @IsString()
  noticeType: string;

  @ApiProperty({
    description: 'BUTTON TYPE(미사용)',
    required: false,
    example: 'BUTTON',
  })
  @Prop({ type: String, required: false, default: 'BUTTON' })
  @IsString()
  buttonType: string;

  @ApiProperty({
    description: 'BUTTON LABEL(미사용)',
    required: false,
    example: '',
  })
  @Prop({ type: String, required: false, default: '' })
  @IsString()
  buttonLabel: string;

  @ApiProperty({
    description: '아이콘(미사용)',
    required: false,
    example: '',
  })
  @Prop({ type: String, required: false, default: '' })
  @IsString()
  icon: string;

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

export const NotificationSchema = SchemaFactory.createForClass(Notification);
