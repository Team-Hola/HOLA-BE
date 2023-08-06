import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { toNumber } from '../../common/cast.helper';

export class PostInfiniteScrollQuery {
  @ApiProperty({
    description: '건너뛸 개수',
    default: 0,
    example: '0',
    required: true,
  })
  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  @IsOptional()
  public offset: number = 0;

  @ApiProperty({
    description: '조회할 개수',
    default: 20,
    example: '20',
    required: true,
  })
  @Transform(({ value }) => toNumber(value, { default: 20, min: 0 }))
  @IsNumber()
  @IsOptional()
  public limit: number = 20;
}
