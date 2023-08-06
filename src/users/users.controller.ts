import { UserAuthorizationGuard } from './guard/user-authorization.guard';
import { SignupSuccessResponse } from './dto/signup-success-response';
import { ParseObjectIdPipe } from '../common/pipe/parse-objectid.pipe';
import { UsersService } from './../users/users.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';

import { Types } from 'mongoose';
import { SignupRequest } from './dto/signup-request';
import { QueryRequired } from '../common/decorator/query-required.decorator';
import { Response } from 'express';
import { UserUpdateRequest } from './dto/user-update-request';
import { PostInfiniteScrollQuery } from '../posts/dto/post-infinite-scroll-query';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBody,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { NicknameDuplicationResponse } from './dto/nickname-duplictaion-response';
import { UserSimpleResponse } from './dto/user-simple-response';
import { Post as PostSchema } from '../posts/schema/post.schema';

@ApiTags('users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiOkResponse({
    description: '회원가입 성공',
    type: SignupSuccessResponse,
  })
  @ApiOkResponse({
    status: 400,
    description: '닉네임 중복',
    type: NicknameDuplicationResponse,
  })
  @ApiNotFoundResponse()
  @Post('signup')
  async signUp(@Body() dto: SignupRequest): Promise<SignupSuccessResponse> {
    // 미들웨어 - 닉네임 중복 체크(CheckNicknameDuplicationMiddleware)
    const { id, nickName, position, workExperience } = dto;
    return await this.usersService.signUp(id, nickName, position, workExperience);
  }

  @ApiOperation({ summary: '닉네임을 통한 사용자 조회' })
  @ApiQuery({
    name: 'nickName',
    description: '닉네임',
    example: '홍길동123',
    required: true,
  })
  @ApiOkResponse({
    type: UserSimpleResponse,
  })
  @ApiNotFoundResponse()
  @Get()
  async getUserByNickName(@QueryRequired('nickName') nickName: string): Promise<UserSimpleResponse> {
    return await this.usersService.getSimpleUserByNickname(nickName);
  }

  @ApiOperation({ summary: '사용자 상세 정보 조회' })
  @ApiOkResponse({
    type: UserSimpleResponse,
  })
  @ApiNotFoundResponse()
  @Get(':id')
  async getUserById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId): Promise<UserSimpleResponse> {
    return await this.usersService.getSimpleUserById(id);
  }

  @ApiOperation({ summary: '사용자 정보 수정(마이페이지)' })
  @ApiOkResponse({
    description: '회원가입 성공',
    type: SignupSuccessResponse,
  })
  @ApiBearerAuth()
  @Patch(':id')
  @UseGuards(UserAuthorizationGuard)
  async updateUser(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: UserUpdateRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignupSuccessResponse> {
    // 미들웨어 - 닉네임 중복 체크(CheckNicknameDuplicationMiddleware)
    const result: SignupSuccessResponse = await this.usersService.update(id, dto);

    response.cookie('R_AUTH', result.refreshToken, {
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
    });

    return result;
  }

  @ApiOperation({ summary: '닉네임 중복 체크' })
  @ApiQuery({
    name: 'nickName',
    description: '닉네임',
    example: '홍길동123',
    required: true,
  })
  @ApiBody({
    schema: {
      properties: {
        isExists: { type: 'boolean', example: false, description: '닉네임 중복 여부(true: 중복, false: 중복 X)' },
      },
    },
  })
  @Get(':id/exists')
  async checkNicknameDuplication(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @QueryRequired('nickName') nickName: string,
  ) {
    const isExists: boolean = await this.usersService.checkNicknameDuplication(nickName);
    return {
      isExists,
    };
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @ApiBearerAuth()
  @ApiNoContentResponse()
  @Delete(':id')
  @UseGuards(UserAuthorizationGuard)
  @HttpCode(204)
  async deleteUser(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Res({ passthrough: true }) response: Response) {
    await this.usersService.deleteUser(id);
    response.clearCookie('R_AUTH');
  }

  @ApiOperation({ summary: '관심 등록 글 조회' })
  @ApiOkResponse({
    type: PostSchema,
  })
  @Get(':id/like-post')
  async getLikedPost(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Query() query: PostInfiniteScrollQuery) {
    const { offset, limit } = query;
    return await this.usersService.getLikedPostByUser(id, offset, limit);
  }

  @ApiOperation({ summary: '읽은 글 조회' })
  @ApiOkResponse({
    type: PostSchema,
  })
  @Get(':id/read-post')
  async getUserReadPost(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Query() query: PostInfiniteScrollQuery) {
    const { offset, limit } = query;
    return await this.usersService.getReadPostByUser(id, offset, limit);
  }

  @ApiOperation({ summary: '작성한 글 조회' })
  @ApiOkResponse({
    type: PostSchema,
  })
  @Get(':id/written-post')
  async getWrittenPost(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Query() query: PostInfiniteScrollQuery) {
    const { offset, limit } = query;
    return await this.usersService.getWrittenPostByUser(id, offset, limit);
  }
}
