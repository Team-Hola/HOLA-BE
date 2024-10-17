import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsBooleanString } from 'class-validator';
import { AdStatusCode, AdTypeCode, linkOpenCode } from 'src/CommonCode';

export type AdvertisementDocument = HydratedDocument<Advertisement>;

@Schema({ timestamps: true })
export class Advertisement {
  @ApiProperty({
    description: '광고 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '캠페인 ID',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, ref: 'Campaign', required: true })
  campaignId: Types.ObjectId;

  @ApiProperty({
    enum: AdTypeCode,
    type: String,
    description: '광고유형',
    example: '1',
  })
  @Prop()
  @IsEnum(AdTypeCode)
  @IsString()
  advertisementType: string;

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
    description: '종료일',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  endDate: Date;

  @ApiProperty({
    type: Date,
    description: '실제 종료일(종료 처리된 날짜)',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  realEndDate: Date;

  @ApiProperty({
    enum: AdStatusCode,
    type: String,
    description: '상태(before 진행전, active 진행중, close종료)',
    example: 'before',
  })
  @Prop({ type: String, default: 'before', required: false })
  @IsEnum(AdStatusCode)
  @IsString()
  advertisementStatus: string;

  @ApiProperty({
    description: '링크',
    example: 'holaworld.io',
  })
  @Prop({ type: String, required: true })
  @IsString()
  link: string;

  @ApiProperty({
    enum: linkOpenCode,
    type: String,
    description: '링크 오픈 유형',
    example: 'black',
  })
  @Prop()
  @IsEnum(linkOpenCode)
  @IsString()
  linkOpenType: string;

  @ApiProperty({
    description: '이미지 URL',
    example: 'https://holaworld.io/images/logo/hola_logo_y.png',
  })
  @Prop({ type: String, required: true })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    description: '모바일용 이미지 URL',
    example: 'https://holaworld.io/images/logo/hola_logo_y.png',
  })
  @Prop({ type: String, required: false })
  @IsString()
  smallImageUrl: string;

  @ApiProperty({
    description: '메인 카피',
    example: '메인 카피',
  })
  @Prop({ type: String, required: false })
  @IsString()
  mainCopy: string;

  @ApiProperty({
    description: '서브 카피',
    example: '서브 카피',
  })
  @Prop({ type: String, required: false })
  @IsString()
  subCopy: string;

  @ApiProperty({
    type: Number,
    description: '배너순번',
    example: '1',
  })
  @Prop({ type: Number, default: 99 })
  bannerSequence: number;

  @ApiProperty({
    type: Number,
    description: '조회수',
    example: '1',
  })
  @Prop({ type: Number, default: 0 })
  views: number;

  @ApiProperty({
    description: '이벤트 ID',
    example: '619fa9b2e08659622c654395',
  })
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Types.ObjectId;
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);
