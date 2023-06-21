import { Transform } from 'class-transformer';
import { IsArray, IsString, Max, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
import { toMongoObjectId } from 'src/common/cast.helper';
import { ApiProperty } from '@nestjs/swagger';

export class SignupRequest {
  @ApiProperty({
    description: '사용자 ID',
    example: '619fa9b2e08659622c654395',
    required: true,
  })
  @Transform(toMongoObjectId)
  id: Types.ObjectId;

  @ApiProperty({
    description: '닉네임',
    example: 'Hola!',
    required: true,
  })
  @IsString()
  nickName: string;

  @ApiProperty({
    description: '직군(프론트엔드, 백엔드, 디자인)',
    example: 'FE',
  })
  @IsString()
  position: string;

  @ApiProperty({
    description: '경력(학생, 1년, 2년, 3년)',
    example: '2',
  })
  @IsString()
  workExperience: string;
}
