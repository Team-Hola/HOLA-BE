import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
export type UserDocument = HydratedDocument<User>;

//@Schema()
export class Url {
  //@Prop()
  urlType: string;

  //@Prop()
  url: string;
}

@Schema({ timestamps: true })
export class User {
  @ApiProperty({
    description: '사용자 ID',
    example: '619fa9b2e08659622c654395',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    description: 'Oauth id token',
    required: true,
    example: '106469319468949472569',
  })
  @Prop({ type: String, required: true })
  @IsString()
  idToken: string;

  @ApiProperty({
    description: '로그인 타입(github, google, kakao)',
    required: true,
    example: 'google',
  })
  @Prop({ type: String, required: true })
  @IsString()
  tokenType: string;

  @ApiProperty({
    description: '이메일',
    required: false,
    example: 'hola@gmail.com',
  })
  @Prop({ type: String, trim: true })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: '이름',
    example: '고길동',
    maxLength: 50,
    required: false,
  })
  @Prop({ type: String, maxlength: 50 })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: '닉네임',
    example: 'Hola!',
    maxLength: 100,
    required: true,
  })
  @Prop({ type: String, required: true, maxlength: 100 })
  @IsString()
  nickName: string;

  @ApiProperty({
    description: '비밀번호',
    example: 'qwer1234',
    minLength: 8,
    required: false,
  })
  @Prop({ type: String, minlength: 8 })
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty({
    description: '이미지 명',
    example: 'default.PNG',
    required: true,
  })
  @Prop({ type: String, required: true, default: 'default.PNG' })
  @IsString()
  image: string;

  @ApiProperty({
    type: [String],
    description: '관심 기술스택',
    example: '["java", "javascript"]',
    required: false,
  })
  @Prop([String])
  @IsArray()
  @IsOptional()
  likeLanguages: string[];

  @ApiProperty({
    description: '직군(프론트엔드, 백엔드, 디자인)',
    example: 'FE',
    required: false,
  })
  @Prop()
  @IsString()
  @IsOptional()
  position: string;

  @ApiProperty({
    description: '간단 자기소개',
    example: '안녕하세요.',
    required: false,
  })
  @Prop()
  @IsString()
  @IsOptional()
  introduce: string;

  @ApiProperty({
    description: '경력(학생, 1년, 2년, 3년)',
    example: '2',
    required: false,
  })
  @Prop()
  @IsString()
  @IsOptional()
  workExperience: string;

  @ApiProperty({
    description: '소속 명',
    example: '도미노피자',
    required: false,
  })
  @Prop()
  @IsString()
  @IsOptional()
  organizationName: string;

  @ApiProperty({
    type: Boolean,
    description: '소속 공개여부',
    example: 'false',
    required: false,
  })
  @Prop({ type: Boolean, default: false })
  @IsBoolean()
  @IsOptional()
  organizationIsOpen: boolean;

  @ApiProperty({
    type: Url,
    description: '소개 url',
    required: false,
  })
  @Prop({ type: Array })
  @IsArray()
  @IsOptional()
  urls: [Url];

  @ApiProperty({
    type: Date,
    description: '생성일시',
  })
  @Prop()
  createdAt?: Date;

  @ApiProperty({
    type: Date,
    description: '수정일시',
  })
  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
