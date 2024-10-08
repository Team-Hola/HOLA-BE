import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsBooleanString } from 'class-validator';
import { EventOnOffLineCode, EventTypeCode } from '../../CommonCode';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @ApiProperty({
    description: '공모전 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '제목',
    example: '인프콘 2024',
  })
  @Prop({ type: String, required: true })
  @IsString()
  title: string;

  @ApiProperty({
    description: '내용',
    example: '공모전 내용!',
  })
  @Prop({ type: String, required: true })
  @IsString()
  content: string;

  @ApiProperty({
    enum: EventTypeCode,
    type: String,
    description: '공모전 구분',
    example: 'conference',
  })
  @Prop({ type: String, required: true })
  @IsEnum(EventTypeCode)
  @IsString()
  eventType: string;

  @ApiProperty({
    enum: EventOnOffLineCode,
    type: String,
    description: '진행방식',
    example: 'on',
  })
  @Prop({ type: String, required: true })
  @IsEnum(EventOnOffLineCode)
  @IsString()
  onlineOrOffline: string;

  @ApiProperty({
    description: '장소',
    example: '서울역',
  })
  @Prop({ type: String, required: true })
  @IsString()
  place: string;

  @ApiProperty({
    description: '주최자명',
    example: 'Team Hola!',
  })
  @Prop({ type: String, required: true })
  @IsString()
  organization: string;

  @ApiProperty({
    description: '원문 링크',
    example: 'naver.com',
  })
  @Prop({ type: String, required: true })
  @IsString()
  link: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'naver.com',
  })
  @Prop({ type: String, required: true })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    description: '이미지 URL(Small)',
    example: 'naver.com',
  })
  @Prop({ type: String, required: true })
  @IsString()
  smallImageUrl: string;

  @ApiProperty({
    type: Date,
    description: '시작일',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: '시작일',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  endDate: Date;

  @ApiProperty({
    type: Date,
    description: '신청시작일',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  applicationStartDate: Date;

  @ApiProperty({
    type: Date,
    description: '신청종료일',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  applicationEndDate: Date;

  @ApiProperty({
    type: Date,
    description: '모집 마감일(자동 마감용도)',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  closeDate: Date;

  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @ApiProperty({
    type: Boolean,
    description: '마감 여부',
    example: 'false',
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  isClosed: boolean;

  @ApiProperty({
    type: Number,
    description: '조회수',
    example: '265',
  })
  @Prop({ type: Number, default: 0 })
  views: number;

  @ApiProperty({
    type: Number,
    description: '관심 등록 수',
    example: '5',
  })
  @Prop({ type: Number, default: 0 })
  totalLikes: number;

  @ApiProperty({
    type: Array,
    description: '관심 등록 사용자 ID 리스트',
    example: '["619fa9b2e08659622c654395", "619fa9b2e08659622c654395"]',
  })
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  likes: Types.ObjectId[];

  @ApiProperty({
    description: '공모전 설명',
    example: '설명',
  })
  @Prop({ type: String, required: true })
  @IsString()
  description: string;

  @ApiProperty({
    type: Boolean,
    description: '무료 여부',
    example: 'false',
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  isFree: boolean;

  @ApiProperty({
    type: Number,
    description: '금액',
    example: '265000',
  })
  @Prop({ type: Number, default: 0 })
  price: number;
}

export const EventSchema = SchemaFactory.createForClass(Event);
