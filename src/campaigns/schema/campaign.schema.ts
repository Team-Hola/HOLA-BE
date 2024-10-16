import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, IsBooleanString } from 'class-validator';
import { AdStatusCode, CampaignConversionCode } from 'src/CommonCode';

export type CampaignDocument = HydratedDocument<Campaign>;

@Schema({ timestamps: true })
export class Campaign {
  @ApiProperty({
    description: '캠페인 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: '캠페인 명',
    example: '인프콘 2024',
  })
  @Prop({ type: String, required: true })
  @IsString()
  title: string;

  @ApiProperty({
    description: '회사명',
    example: 'Team hola!',
  })
  @Prop({ type: String, required: false })
  @IsString()
  companyName: string;

  @ApiProperty({
    description: '담당자명',
    example: '김갑수',
  })
  @Prop({ type: String, required: false })
  @IsString()
  managerName: string;

  @ApiProperty({
    description: '담당자 메일',
    example: 'abc@gmail.com',
  })
  @Prop({ type: String, required: false })
  @IsString()
  managerEmail: string;

  @ApiProperty({
    description: '담당자 휴대폰 번호',
    example: '010-1234-5678',
  })
  @Prop({ type: String, required: false })
  @IsString()
  managerPhone: string;

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
    type: Number,
    description: '기본 광고비',
    example: '2500000',
  })
  @Prop({ type: Number, default: 0 })
  basicAdvertisingFee: number;

  @ApiProperty({
    enum: CampaignConversionCode,
    type: String,
    description: '광고유형(conversion 전환형, view 노출형)',
    example: '1',
  })
  @Prop()
  @IsEnum(CampaignConversionCode)
  @IsString()
  conversionType: string;

  @ApiProperty({
    type: Number,
    description: '전환당 단가',
    example: '150',
  })
  @Prop({ type: Number, default: 0 })
  conversionCost: number;

  @ApiProperty({
    enum: AdStatusCode,
    type: String,
    description: '상태(before 진행전, active 진행중, close종료)',
    example: '1',
  })
  @Prop()
  @IsEnum(AdStatusCode)
  @IsString()
  campaignStatus: string;

  @ApiProperty({
    type: Number,
    description: '예상 노출수',
    example: '20000',
  })
  @Prop({ type: Number, default: 0 })
  expectedImpressions: number;

  @ApiProperty({
    description: '비고',
    example: '노티 필수',
  })
  @Prop({ type: String, required: false })
  @IsString()
  remark: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
