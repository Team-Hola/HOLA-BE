import { Request, Response } from 'express';

import { PostCreateRequest } from './dto/post-create-request';
import { GetAuthUserGuard } from '../auth/guard/get-auth-user.guard';
import { PostsService } from './posts.service';
import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PostMainGetCondition } from './dto/post-main-get-condition';
import { PostMainListResponse } from './dto/post-main-list-response';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AccessTokenPayload } from 'src/jwt/jwt.service';
import { PostTopListResponse } from './dto/post-top-list-response';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-objectid.pipe';
import { Types } from 'mongoose';
import { PostRecommendedListResponse } from './dto/post-recommended-list-response';
import { PostDetailResponse } from './dto/post-detail-response';
import { AuthenticationGuard } from 'src/auth/guard/authentication.guard';
import { Req } from '@nestjs/common';
import { PostUpdateRequest } from './dto/post-update-request';
import { LikeAddRequest } from './dto/like-add-request';
import {
  ApiOkResponse,
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Post as PostSchema } from 'src/posts/schema/post.schema';
import { LikeUserGetResponse } from './dto/like-user-get-response';
import { CommentListResponse } from './dto/comment-list-response';
import { CommentCreateRequest } from './dto/comment-create-request';
import { CommentUpdateRequest } from './dto/comment-update-request';
import { User } from 'src/auth/user.decorator';

@ApiTags('posts')
@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '이번주 인기글 조회' })
  @ApiOkResponse({
    type: [PostTopListResponse],
  })
  @Get('top')
  async getPostTopList(): Promise<PostTopListResponse[]> {
    return await this.postsService.getPostTopList();
  }

  @ApiOperation({ summary: '모집 메인 조회(페이지네이션)' })
  @ApiOkResponse({
    type: [PostMainListResponse],
  })
  @ApiBearerAuth()
  @Get('pagination')
  @UseGuards(GetAuthUserGuard)
  async getPostList(
    @User('_id') userId: string | null,
    @Query() dto: PostMainGetCondition,
  ): Promise<PostMainListResponse[]> {
    return await this.postsService.getPostList(dto, new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: '페이지네이션 마지막 페이지 조회' })
  @ApiBody({
    schema: {
      properties: {
        lastPage: { type: 'numer', example: 15, description: '마지막 페이지' },
      },
    },
  })
  @Get('pagination/last-page')
  async getPostLastPage(@Query() dto: PostMainGetCondition) {
    const lastPage = await this.postsService.getMainLastPage(dto);
    return {
      lastPage,
    };
  }

  @ApiOperation({ summary: '모집글 상세 조회' })
  @ApiOkResponse({
    type: PostDetailResponse,
  })
  @ApiNotFoundResponse()
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(GetAuthUserGuard)
  async getPost(
    @User('_id') userId: string | null,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PostDetailResponse> {
    return await this.postsService.getPostById(id, new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: '모집 추천글 조회' })
  @ApiOkResponse({
    type: [PostRecommendedListResponse],
  })
  @ApiBearerAuth()
  @Get(':id/recommended')
  @UseGuards(GetAuthUserGuard)
  async getRecommendedPostList(
    @User('_id') userId: string | null,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PostRecommendedListResponse[]> {
    return await this.postsService.getRecommendedPostList(id, new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: '글 등록' })
  @ApiCreatedResponse({ type: PostSchema })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @HttpCode(201)
  async createPost(@User('_id') userId: string, @Body() dto: PostCreateRequest) {
    return this.postsService.createPost(new Types.ObjectId(userId), dto);
  }

  @ApiOperation({ summary: '글 수정' })
  @ApiOkResponse({
    type: PostSchema,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async updatePost(
    @User('_id') userId: string,
    @User('tokenType') tokenType: string,
    @Param('id', ParseObjectIdPipe) postId: Types.ObjectId,
    @Body() dto: PostUpdateRequest,
  ) {
    return this.postsService.updatePost(postId, dto, new Types.ObjectId(userId), tokenType);
  }

  @ApiOperation({ summary: '글 삭제' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(
    @User('_id') userId: string,
    @User('tokenType') tokenType: string,
    @Param('id', ParseObjectIdPipe) postId: Types.ObjectId,
  ) {
    await this.postsService.deletePost(postId, new Types.ObjectId(userId), tokenType);
  }

  @ApiOperation({ summary: '관심 등록(좋아요)' })
  @ApiCreatedResponse({
    type: LikeUserGetResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('likes')
  @HttpCode(201)
  async addLike(@User('_id') userId: string | null, @Body() dto: LikeAddRequest) {
    const { postId } = dto;
    const likes = await this.postsService.addLike(postId, new Types.ObjectId(userId));
    return {
      likeUsers: likes,
    };
  }

  @ApiOperation({ summary: '관심 등록 취소(좋아요)' })
  @ApiOkResponse({
    type: LikeUserGetResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete('likes/:id')
  @HttpCode(200)
  async deleteLike(@Param('id', ParseObjectIdPipe) postId: Types.ObjectId, @User('_id') userId: string) {
    const likes = await this.postsService.deleteLike(postId, new Types.ObjectId(userId));
    return {
      likeUsers: likes,
    };
  }

  @ApiOperation({ summary: '관심 등록한 사용자 리스트 조회' })
  @ApiOkResponse({
    type: LikeUserGetResponse,
  })
  @Get(':id/likes')
  async getLikeUserList(@Param('id', ParseObjectIdPipe) postId: Types.ObjectId) {
    const likes = await this.postsService.getLikedUserList(postId);
    return {
      likeUsers: likes,
    };
  }

  @ApiOperation({ summary: '댓글 리스트 조회' })
  @ApiOkResponse({
    type: CommentListResponse,
  })
  @Get('comments/:id')
  async getCommentList(@Param('id', ParseObjectIdPipe) postId: Types.ObjectId) {
    const comments = await this.postsService.getCommentList(postId);
    return {
      comments,
    };
  }

  @ApiOperation({ summary: '댓글 등록' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('comments')
  @HttpCode(201)
  async createComment(
    @User('_id') userId: string,
    @User('nickName') nickName: string,
    @Body() dto: CommentCreateRequest,
  ) {
    const { postId, content } = dto;
    return await this.postsService.createComment(postId, content, new Types.ObjectId(userId), nickName);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Patch('comments/:id')
  async updateComment(
    @User('_id') userId: string,
    @User('tokenType') tokenType: string,
    @Param('id', ParseObjectIdPipe) commentId: Types.ObjectId,
    @Body() dto: CommentUpdateRequest,
  ) {
    const { content } = dto;
    return await this.postsService.updateComment(commentId, content, new Types.ObjectId(userId), tokenType);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete('comments/:id')
  @HttpCode(200)
  async deleteComment(
    @User('_id') userId: string,
    @User('tokenType') tokenType: string,
    @Param('id', ParseObjectIdPipe) commentId: Types.ObjectId,
  ) {
    await this.postsService.deleteComment(commentId, new Types.ObjectId(userId), tokenType);
  }
}
