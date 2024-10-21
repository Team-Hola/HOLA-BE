import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserPositionCode, UserWorkExperienceCode, userSkillCode, userStatusCode, UserUrlType } from 'src/CommonCode';
export type UserDocument = HydratedDocument<User>;

//@Schema()
export class Url {
  @ApiProperty({ enum: UserUrlType, description: 'url 형식' })
  @Prop(String)
  @IsEnum(UserUrlType)
  @IsString()
  urlType: string;

  @ApiProperty({
    description: 'URL',
    example: 'naver.com',
  })
  @IsString()
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
  @Prop({ type: String, required: false, maxlength: 100 })
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
    enum: userSkillCode,
    isArray: true,
    description: '사용자 기술스택',
    example: '["java", "javascript"]',
  })
  @Prop([String])
  @IsEnum(userSkillCode, { each: true })
  @IsArray()
  @IsOptional()
  likeLanguages: string[];

  @ApiProperty({
    enum: UserPositionCode,
    description: '사용자 포지션',
    example: 'BE',
  })
  @Prop()
  @IsEnum(UserPositionCode)
  @IsOptional()
  position: string;

  @ApiProperty({
    description: '간단 자기소개',
    example: '안녕하세요.',
    required: false,
  })
  @Prop({ type: String, default: '' })
  @IsString()
  @IsOptional()
  introduce: string;

  @ApiProperty({
    enum: UserWorkExperienceCode,
    description: '경력',
    example: '1',
  })
  @Prop()
  @IsOptional()
  @IsEnum(UserWorkExperienceCode)
  workExperience: string;

  @ApiProperty({
    description: '소속 명',
    example: '도미노피자',
    required: false,
  })
  @Prop({ type: String, default: '' })
  @IsString()
  @IsOptional()
  organizationName: string;

  @ApiProperty({
    type: Boolean,
    description: '소속 공개여부',
    example: 'false',
    required: false,
    default: false,
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
  @Prop([Url])
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

  @ApiProperty({ enum: userStatusCode, isArray: true, description: '유저 상태' })
  @Prop([String])
  @IsEnum(userStatusCode, { each: true })
  @IsArray()
  status: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
