import { LikePostsService } from './../like-posts/like-posts.service';
import sanitizeHtml from 'sanitize-html';
import { ReadPostsService } from './../read-posts/read-posts.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { PostDetailResponse } from './dto/post-detail-response';
import { PostMainGetCondition } from './dto/post-main-get-condition';
import { PostBadge, PostBadgeType, PostMainFindResult, PostMainListResponse } from './dto/post-main-list-response';
import { PostRecommendedListResponse } from './dto/post-recommended-list-response';
import { PostTopListResponse } from './dto/post-top-list-response';
import { PostPOJO, PostsRepository } from './posts.repository';
import { PostCreateRequest } from './dto/post-create-request';
import { PostUpdateRequest } from './dto/post-update-request';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Post } from './schema/post.schema';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly readPostsService: ReadPostsService,
    private readonly likePostsService: LikePostsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getPostById(postId: Types.ObjectId, userId: Types.ObjectId | null): Promise<PostDetailResponse> {
    const post: PostPOJO = await this.postsRepository.findPostDetail(postId);
    if (!post) throw new NotFoundException('Post not found');
    await this.increaseView(postId, userId);

    const today: Date = new Date();
    const daysAgo: Date = new Date();
    const millisecondDay: number = 1000 * 60 * 60 * 24;
    daysAgo.setDate(today.getDate() - 1); // 24시간 이내
    const postDetail: PostDetailResponse = {
      ...post,
      badge: this.getBadge(post.type, post.createdAt, post.startDate, post.views, today, daysAgo, millisecondDay),
    };
    return postDetail;
  }

  // 조회수 증가
  async increaseView(postId: Types.ObjectId, userId: Types.ObjectId) {
    // 읽은 목록 중복 삽입 방지
    if (userId) {
      await Promise.all([
        await this.readPostsService.create(postId, userId),
        await this.postsRepository.increaseView(postId),
      ]);
    } else {
      await this.postsRepository.increaseView(postId); // 조회수 증가
    }
  }

  async getRecommendedPostList(
    postId: Types.ObjectId,
    userId: Types.ObjectId | null,
  ): Promise<PostRecommendedListResponse[]> {
    const LIMIT = 10;
    const post = await this.postsRepository.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    const { language } = post;
    const posts: PostRecommendedListResponse[] = await this.postsRepository.findRecommendedPostByLanguage(
      postId,
      language,
      LIMIT,
      userId,
    );
    if (posts.length === LIMIT) return posts;
    const expectPosts = posts.map((post) => {
      return post._id;
    });
    const remainPosts: PostRecommendedListResponse[] = await this.postsRepository.findRecommendedPostByView(
      postId,
      LIMIT - posts.length,
      userId,
      expectPosts,
    );
    posts.push(...remainPosts);
    return posts;
  }

  // 인기글 조회(메인)
  async getPostTopList(): Promise<PostTopListResponse[]> {
    const posts: PostPOJO[] = await this.postsRepository.findTopPost(10);
    const today: Date = new Date();
    const daysAgo: Date = new Date();
    const millisecondDay: number = 1000 * 60 * 60 * 24;
    daysAgo.setDate(today.getDate() - 1); // 24시간 이내
    // 가상 필드 추가
    const result = posts.map((post: PostPOJO): PostTopListResponse => {
      return {
        type: post.type,
        startDate: post.startDate,
        title: post.title,
        language: post.language,
        positions: post.positions,
        views: post.views,
        author: post.author,
        likes: post.likes,
        comments: post.comments,
        createdAt: post.createdAt,
        badge: this.getBadge(post.type, post.createdAt, post.startDate, post.views, today, daysAgo, millisecondDay),
      };
    });
    return result;
  }

  // 모집글 조회(메인)
  async getPostList(dto: PostMainGetCondition, userId: Types.ObjectId | null): Promise<PostMainListResponse[]> {
    const { page, language, isClosed, type, position, search, onOffLine } = dto;
    const posts: PostMainFindResult[] = await this.postsRepository.findMainList(
      page,
      language,
      isClosed,
      type,
      position,
      search,
      onOffLine,
    );

    const today: Date = new Date();
    const daysAgo: Date = new Date();
    const millisecondDay: number = 1000 * 60 * 60 * 24;
    daysAgo.setDate(today.getDate() - 1); // 24시간 이내
    // 가상 필드 추가
    const result = posts.map((post: PostMainListResponse) => {
      post.isLiked = this.isLikedPost(post.likes, userId);
      post.totalComments = post.comments.length;
      post.badge = this.getBadge(post.type, post.createdAt, post.startDate, post.views, today, daysAgo, millisecondDay);
      return post;
    });

    return result;
  }

  // Pagination 마지막 페이지 조회
  async getMainLastPage(dto: PostMainGetCondition) {
    const { language, isClosed, type, position, search, onOffLine } = dto;
    const totalCount = await this.postsRepository.findMainLastPage(
      language,
      isClosed,
      type,
      position,
      search,
      onOffLine,
    );
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    return Math.ceil(totalCount / itemsPerPage);
  }

  // 가상 필드 - 사용자의 관심 등록 여부
  private isLikedPost(likes: Types.ObjectId[], userId: Types.ObjectId | null): boolean {
    if (!userId || !likes || likes.length < 1) return false;
    for (const likeUserId of likes) {
      if (likeUserId.toString() == userId.toString()) {
        return true;
      }
    }
    return false;
  }
  // 가상 필드 - 뱃지
  private getBadge(
    type: string,
    createdAt: Date,
    startDate: Date,
    views: number,
    today: Date,
    daysAgo: Date,
    millisecondDay: number,
  ): PostBadge[] {
    let badge: PostBadge[] = [];
    if (createdAt > daysAgo) badge.push(this.addBadge('new', '🍞따끈따끈 새 글'));
    else if (startDate > today && (startDate.getTime() - today.getTime()) / millisecondDay <= 3)
      badge.push(this.addBadge('deadline', `마감 ${this.timeForEndDate(startDate, today)}`));
    else if (Math.abs(views / Math.ceil((today.getTime() - createdAt.getTime()) / millisecondDay)) >= 60)
      badge.push(this.addBadge('hot', '💙 인기'));

    return badge;
  }

  private addBadge(type: PostBadgeType, content: string): PostBadge {
    return {
      type,
      content,
    };
  }

  // ~시간 전 구하기
  private timeForEndDate(endDate: Date, today: Date): string {
    const betweenTime: number = Math.floor((endDate.getTime() - today.getTime()) / 1000 / 60);

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay > 1 && betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`;
    }
    const betweenTimeHour = Math.floor(betweenTime / 60);
    return `${betweenTimeHour}시간전`;
  }

  async getWrittenPostByUser(userId: Types.ObjectId, offset: number, limit: number) {
    return await this.postsRepository.findPostByAuthor(userId, offset, limit);
  }

  async createPost(userId: Types.ObjectId, dto: PostCreateRequest) {
    dto.content = this.getSanitizeHtml(dto.content);
    return await this.postsRepository.createPost(userId, dto);
  }

  async updatePost(postId: Types.ObjectId, dto: PostUpdateRequest, userId: Types.ObjectId, tokenType: string) {
    await this.checkPostAuthorization(postId, userId, tokenType);

    if (dto.content) dto.content = this.getSanitizeHtml(dto.content);
    return this.postsRepository.updatePost(postId, dto);
  }

  async deletePost(postId: Types.ObjectId, userId: Types.ObjectId, tokenType: string) {
    await this.checkPostAuthorization(postId, userId, tokenType);
    await this.postsRepository.deletePost(postId);
  }

  getSanitizeHtml(content: string): string {
    return sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    });
  }

  async addLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { likes, isLikeExist } = await this.postsRepository.addLike(postId, userId);
    if (!isLikeExist) {
      await this.likePostsService.add(postId, userId);
    }
    return likes;
  }

  async deleteLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { likes, isLikeExist } = await this.postsRepository.deleteLike(postId, userId);
    if (!isLikeExist) {
      await this.likePostsService.delete(postId, userId);
    }
    return likes;
  }

  async getLikedUserList(postId: Types.ObjectId) {
    return this.postsRepository.findLikedUsers(postId);
  }

  async getCommentList(postId: Types.ObjectId) {
    return this.postsRepository.findCommentList(postId);
  }

  async createComment(postId: Types.ObjectId, content: string, author: Types.ObjectId, nickName: string) {
    const { post, commentId } = await this.postsRepository.createComment(postId, content, author); // 댓글 추가
    await this.notificationsService.createNotification(
      'comment',
      post.author,
      nickName,
      postId,
      author,
      commentId,
      content,
    ); // 댓글 알림 추가
  }

  async updateComment(commentId: Types.ObjectId, content: string, userId: Types.ObjectId, tokenType: string) {
    await this.checkCommentAuthorization(commentId, userId, tokenType);
    await this.postsRepository.updateComment(commentId, content);
  }

  async deleteComment(commentId: Types.ObjectId, userId: Types.ObjectId, tokenType: string) {
    await this.checkCommentAuthorization(commentId, userId, tokenType);
    await this.postsRepository.deleteComment(commentId);
  }

  // 글 인가 체크
  // - 자신이 등록한 댓글만 수정 가능
  // - admin인 경우 제외
  async checkPostAuthorization(postId: Types.ObjectId, userId: Types.ObjectId, tokenType: string) {
    if (tokenType === 'admin') return;
    const post = await this.postsRepository.findPostByIdAndAuthor(postId, userId);
    if (!post) {
      throw new UnauthorizedException();
    }
  }

  // 댓글 인가 체크
  // - 자신이 등록한 댓글만 수정 가능
  // - admin인 경우 제외
  async checkCommentAuthorization(commentId: Types.ObjectId, userId: Types.ObjectId, tokenType: string) {
    if (tokenType === 'admin') return;
    const post = await this.postsRepository.findCommentByIdAndAuthor(commentId, userId);
    if (!post) {
      throw new UnauthorizedException();
    }
  }

  // 회원 탈퇴 시 사용자가 작성한 글 제거
  async deletePostBySignOutUser(userId: Types.ObjectId) {
    await this.postsRepository.deletePostByAuthor(userId);
  }

  // 회원 탈퇴 시 사용자가 작성한 댓글 제거
  async deleteCommentBySignOutUser(userId: Types.ObjectId) {
    await this.postsRepository.deleteCommentByAuthor(userId);
  }
}
