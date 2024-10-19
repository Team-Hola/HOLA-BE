import { Transform } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { toMongoObjectId } from '../../common/cast.helper';
import { ApiProperty } from '@nestjs/swagger';
import { PostPositionsCode, UserWorkExperienceCode, userStatusCode } from '../../CommonCode';

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
  @IsEnum(PostPositionsCode)
  @IsString()
  position: string;

  @ApiProperty({
    description: '경력(학생, 1년, 2년, 3년)',
    example: '2',
  })
  @IsEnum(UserWorkExperienceCode)
  @IsString()
  workExperience: string;

  @ApiProperty({ enum: userStatusCode, isArray: true, description: '유저 상태' })
  @IsEnum(userStatusCode, { each: true })
  status: string[];
}
