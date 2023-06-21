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
  ApiQuery,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiBody,
  ApiNoContentResponse,
} from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '이번주 인기글 조회' })
  @Get('top')
  async getPostTopList(): Promise<PostTopListResponse[]> {
    return await this.postsService.getPostTopList();
  }

  @ApiOperation({ summary: '모집 메인 조회(페이지네이션)' })
  @Get('pagination')
  @UseGuards(GetAuthUserGuard)
  async getPostList(
    @AuthUser() user: AccessTokenPayload,
    @Query() dto: PostMainGetCondition,
  ): Promise<PostMainListResponse[]> {
    const userId = user && '_id' in user ? user._id : null;
    return await this.postsService.getPostList(dto, userId);
  }

  @ApiOperation({ summary: '페이지네이션 마지막 페이지 조회' })
  @Get('pagination/last-page')
  async getPostLastPage(@Query() dto: PostMainGetCondition) {
    const lastPage = await this.postsService.getMainLastPage(dto);
    return {
      lastPage,
    };
  }

  @ApiOperation({ summary: '모집글 상세 조회' })
  @Get(':id')
  @UseGuards(GetAuthUserGuard)
  async getPost(
    @AuthUser() user: AccessTokenPayload,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PostDetailResponse> {
    const userId = user && '_id' in user ? user._id : null;
    return await this.postsService.getPostById(id, userId);
  }

  @ApiOperation({ summary: '모집 추천글 조회' })
  @Get(':id/recommended')
  @UseGuards(GetAuthUserGuard)
  async getRecommendedPostList(
    @AuthUser() user: AccessTokenPayload,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PostRecommendedListResponse[]> {
    const userId = user && '_id' in user ? user._id : null;
    return await this.postsService.getRecommendedPostList(id, userId);
  }

  @ApiOperation({ summary: '모집 글 등록' })
  @UseGuards(AuthenticationGuard)
  @Post()
  @HttpCode(201)
  async createPost(@Req() request: Request, @Body() dto: PostCreateRequest) {
    const user: AccessTokenPayload = request['user'];
    const userId = user._id;
    return this.postsService.createPost(userId, dto);
  }

  @ApiOperation({ summary: '모집 글 수정' })
  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async updatePost(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() dto: PostUpdateRequest) {
    return this.postsService.updatePost(id, dto);
  }

  @ApiOperation({ summary: '관심 등록(좋아요)' })
  @UseGuards(AuthenticationGuard)
  @Post('likes')
  @HttpCode(201)
  async addLike(@Req() request: Request, @Body() dto: LikeAddRequest) {
    const user: AccessTokenPayload = request['user'];
    const userId = user._id;
    const { postId } = dto;
    const likes = this.postsService.addLike(postId, userId);
    return {
      likeUsers: likes,
    };
  }

  @ApiOperation({ summary: '관심 등록 취소(좋아요)' })
  @UseGuards(AuthenticationGuard)
  @Delete('likes/:id')
  @HttpCode(204)
  async deleteLike(@Param('id', ParseObjectIdPipe) postId: Types.ObjectId, @Req() request: Request) {
    const user: AccessTokenPayload = request['user'];
    const userId = user._id;
    const likes = await this.postsService.deleteLike(postId, userId);
    return {
      likeUsers: likes,
    };
  }

  @ApiOperation({ summary: '관심 등록한 사용자 리스트' })
  @Get(':id/likes')
  @UseGuards(GetAuthUserGuard)
  async getLikeUserList(@Param('id', ParseObjectIdPipe) postId: Types.ObjectId) {
    const likes = await this.postsService.getLikedUserList(postId);
    return {
      likeUsers: likes,
    };
  }
}
