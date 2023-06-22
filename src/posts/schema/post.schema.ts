import { User } from '../../users/schema/user.schema';
import { Comment, CommentSchema } from './comment.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsBooleanString } from 'class-validator';
import {
  PostContactTypeCode,
  PostExpectedPeriodCode,
  PostLanguageCode,
  PostOnlineOrOfflineCode,
  PostPositionsCode,
  PostRecruitsCode,
  PostTypeCode,
} from 'src/CommonCode';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({
    description: '글 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '작성자 ID',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @ApiProperty({
    type: Array,
    description: '사용언어',
    example: '["java", "javascript"]',
  })
  @Prop([String])
  @IsEnum(PostLanguageCode, { each: true })
  @IsArray()
  language: string[];

  @ApiProperty({
    description: '제목',
    example: '같이 스터디 하실분!',
  })
  @Prop({ type: String, required: true })
  @IsString()
  title: string;

  @ApiProperty({
    description: '내용',
    example: '모각코 하실분 구합니다',
  })
  @Prop({ type: String, required: true })
  @IsString()
  content: string;

  @ApiProperty({
    type: Boolean,
    description: '삭제 여부',
    example: 'false',
  })
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
    type: [Comment],
    description: '댓글',
  })
  @Prop({ type: [CommentSchema] })
  comments: Comment[];

  @ApiProperty({
    type: Array,
    description: '관심 등록 사용자 ID 리스트',
    example: '["619fa9b2e08659622c654395", "619fa9b2e08659622c654395"]',
  })
  @Prop({ type: [Types.ObjectId], ref: 'User' })
  likes: Types.ObjectId[];

  @ApiProperty({
    type: Number,
    description: '관심 등록 수',
    example: '5',
  })
  @Prop({ type: Number, default: 0 })
  totalLikes: number;

  @ApiProperty({
    type: Date,
    description: '시작예정일',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  startDate: Date;

  @ApiProperty({
    type: Date,
    description: '종료일(사용 X)',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  endDate: Date;

  @ApiProperty({
    type: String,
    description: '모집구분(1: 프로젝트, 2: 스터디)',
    example: '1',
  })
  @Prop()
  @IsEnum(PostTypeCode)
  @IsString()
  type: string;

  @ApiProperty({
    enum: PostRecruitsCode,
    enumName: 'PostRecruitsCode',
    description: '모집인원(und: 미정, 1, 2, 3 .. mo)',
    example: '6',
  })
  @Prop()
  @IsEnum(PostRecruitsCode)
  @IsString()
  recruits: string;

  @ApiProperty({
    enum: PostOnlineOrOfflineCode,
    enumName: 'PostOnlineOrOfflineCode',
    description: '온, 오프라인 구분(on, off, onOff)',
    example: 'on',
  })
  @Prop()
  @IsEnum(PostOnlineOrOfflineCode)
  @IsString()
  onlineOrOffline: string;

  @ApiProperty({
    enum: PostContactTypeCode,
    enumName: 'PostContactTypeCode',
    description: '연락방법(ok, pk, em, gf)',
    example: 'ok',
  })
  @Prop()
  @IsEnum(PostContactTypeCode)
  @IsString()
  contactType: string;

  @ApiProperty({
    type: String,
    description: '연락 링크',
    example: 'https://open.kakao.com/o/sg7FF8qf',
  })
  @Prop()
  @IsString()
  contactPoint: string;

  @ApiProperty({
    enum: PostExpectedPeriodCode,
    enumName: 'PostExpectedPeriodCode',
    description: '예상진행기간(und, 1, 2, 3)',
    example: '3',
  })
  @Prop()
  @IsEnum(PostExpectedPeriodCode)
  @IsString()
  expectedPeriod: string;

  @ApiProperty({
    type: String,
    description: '포지션(FE, BE, DE)',
    example: '["FE", "BE"]',
  })
  @Prop([String])
  @IsEnum(PostPositionsCode, { each: true })
  @IsArray()
  positions: string[];

  @ApiProperty({
    type: Date,
    description: '마감처리일시',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  closeDate: Date;

  @ApiProperty({
    type: Date,
    description: '삭제처리일시',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  deleteDate: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
