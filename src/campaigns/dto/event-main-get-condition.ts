import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { toBoolean, toNumber } from '../../common/cast.helper';
import {
  EventOnOffLineCode,
  EventTypeCode,
  PostLanguageCode,
  PostOnlineOrOfflineCode,
  PostPositionsCode,
  PostTypeCode,
} from '../../CommonCode';

export class EventMainGetCondition {
  @ApiProperty({
    type: Number,
    description: '현재 페이지',
    default: '1',
    example: '2',
  })
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    type: String,
    description: '정렬(최신순: -createdAt, 인기순: -views)',
    example: '-createdAt',
  })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiProperty({
    enum: EventTypeCode,
    type: String,
    description: '공모전 구분(conference, hackathon, contest, bootcamp, others)',
    example: '1',
  })
  @IsEnum(EventTypeCode)
  @IsString()
  @IsOptional()
  eventType?: string;

  @ApiProperty({
    enum: EventOnOffLineCode,
    type: String,
    description: '진행방식(on:온라인, off:오프라인, onOff: 온/오프라인)',
    example: '1',
  })
  @IsEnum(EventOnOffLineCode)
  @IsString()
  @IsOptional()
  onOffLine?: string;

  @ApiProperty({
    type: String,
    description: '검색',
    example: '모각코',
  })
  @IsString()
  @IsOptional()
  search?: string;
}
