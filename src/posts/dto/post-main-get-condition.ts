import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PostMainGetCondition {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  page?: number = 1;

  @IsOptional()
  @IsArray()
  @Transform(({ value, obj }) => {
    return value.split(',');
  })
  language?: string[];

  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  onOffLine?: string;
}
