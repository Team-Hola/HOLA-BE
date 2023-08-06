import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { toBoolean, toNumber } from '../../common/cast.helper';
import { PostLanguageCode, PostOnlineOrOfflineCode, PostPositionsCode, PostTypeCode } from '../../CommonCode';

export class PostMainGetCondition {
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
    description: '검색',
    example: '모각코',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    enum: PostLanguageCode,
    type: Array,
    description: '사용언어',
    example: '["java", "javascript"]',
  })
  @IsArray()
  @Transform(({ value, obj }) => {
    return value.split(',');
  })
  @IsOptional()
  language?: string[];

  @ApiProperty({
    type: Boolean,
    description: '마감 여부',
    example: 'false',
  })
  @Transform(({ value }) => toBoolean(value))
  @IsBoolean()
  @IsOptional()
  isClosed?: boolean;

  @ApiProperty({
    enum: PostTypeCode,
    type: String,
    description: '모집구분(1: 프로젝트, 2: 스터디)',
    example: '1',
  })
  @IsEnum(PostTypeCode)
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    enum: PostPositionsCode,
    type: String,
    description: '포지션(FE, BE, DE)',
    example: 'FE',
  })
  @IsEnum(PostPositionsCode)
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({
    enum: PostOnlineOrOfflineCode,
    enumName: 'PostOnlineOrOfflineCode',
    description: '온, 오프라인 구분(on, off, onOff)',
    example: 'on',
  })
  @IsEnum(PostOnlineOrOfflineCode)
  @IsString()
  @IsOptional()
  onOffLine?: string;
}
