import { PostsService } from './../posts/posts.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LikePostsService } from 'src/like-posts/like-posts.service';

@Injectable()
export class DashboardsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly likepostsService: LikePostsService,
  ) {}

  // 데일리 액션) 현재 총 회원 수, 오늘 가입자, 오늘 탈퇴자
  async getUserDaliyAction() {
    const totalUser: number = await this.usersService.countUsers(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const signUp: number = await this.usersService.countUsers(today);
    const signOut: number = await this.usersService.countSignOutUsers(today);

    return {
      totalUser,
      signUp,
      signOut,
    };
  }

  // 모집글 집계
  async getPostTotalLikes() {
    const totalUser: number = await this.usersService.countUsers(null);
    const totalLikes: number = await this.likepostsService.countLikePosts();
    const average = (totalLikes / totalUser).toFixed(2);
    return {
      totalLikes,
      totalUser,
      average,
    };
  }

  // 일자별 회원 가입 현황(일자 / 신규 가입자 / 탈퇴자)
  async aggregateDailySignups(startDate: Date, endDate: Date) {
    return await this.usersService.aggregateDailySignups(startDate, endDate);
  }

  // 게시글 데일리(오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 )
  async getPostDailyAction() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let totalView = 0;
    const totalViewSum = await this.postsService.getTodayViewCount(today);
    if (totalViewSum && totalViewSum.length > 0 && totalViewSum[0].totalView) totalView = totalViewSum[0].totalView;

    const created: number = await this.postsService.countDocument('createdAt', today);
    const closed: number = await this.postsService.countDocument('createdAt', today);
    const deleted: number = await this.postsService.countDocument('createdAt', today);
    return {
      totalView,
      created,
      closed,
      deleted,
    };
  }

  // 일자별 게시글 현황(일자 / 등록된 글 / 마감된 글 / 삭제된 글)
  async getDailyPostStats(startDate: Date, endDate: Date) {
    return await this.postsService.getDailyPostStats(startDate, endDate);
  }
  // 사용자가 선택하는 정보 집계
  async getUserSelectFields() {
    const position = await this.usersService.aggreagteSelectionFields('position');
    const workExperience = await this.usersService.aggreagteSelectionFields('workExperience');
    const likeLanguages = await this.usersService.aggreagteSelectionFields('likeLanguages');
    const status = await this.usersService.aggreagteSelectionFields('status');
    return { position, workExperience, likeLanguages, status };
  }
  // 글 등록 시 선택하는 정보 집계
  async getPostSelectFields() {
    const type = await this.postsService.aggreagteSelectionFields('type');
    const recruits = await this.postsService.aggreagteSelectionFields('recruits');
    const onlineOrOffline = await this.postsService.aggreagteSelectionFields('onlineOrOffline');
    const expectedPeriod = await this.postsService.aggreagteSelectionFields('expectedPeriod');
    const positions = await this.postsService.aggreagteSelectionFields('positions');
    const language = await this.postsService.aggreagteSelectionFields('language');
    return { type, recruits, onlineOrOffline, expectedPeriod, positions, language };
  }
}
