import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';
import { AdLogCode } from 'src/CommonCode';

export type AdvertisementLogDocument = HydratedDocument<AdvertisementLog>;

@Schema({ timestamps: true })
export class AdvertisementLog {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Advertisement', required: true })
  advertisementId: Types.ObjectId;

  @ApiProperty({
    enum: AdLogCode,
    type: String,
    description: '로그 유형',
    example: 'impression',
  })
  @Prop({ type: String, default: 'impression', required: true })
  @IsEnum(AdLogCode)
  @IsString()
  logType: string;

  @ApiProperty({
    type: Date,
    description: '로그 발생일자',
    example: '2023-06-01T06:08:48.746+00:00',
  })
  @Prop()
  @IsString()
  logDate: Date;
}

export const AdvertisementLogSchema = SchemaFactory.createForClass(AdvertisementLog);
