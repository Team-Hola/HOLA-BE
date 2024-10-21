import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-objectid.pipe';
import { AuthenticationAdminGuard } from 'src/auth/guard/authentication.admin.guard';
import { DashboardUserDaliyResponse } from './dto/dashboard-user-daliy-response';
import { ParseDatePipe } from 'src/common/pipe/parse-date.pipe';
import { DashboardUserHistoryResponse } from './dto/dashboard-user-history-response';
import { DashboardPostDaliyActionResponse } from './dto/dashboard-post-daliy-action-response';
import { DashboardPostLikesResponse } from './dto/dashboard-post-likes-response';
import { DashboardUserAggregateFieldsResponse } from './dto/dashboard-user-aggregate-fields-response';
import { DashboardPostAggregateFieldsResponse } from './dto/dashboard-post-aggregate-fields-response';

@ApiTags('dashboards')
@Controller('api/dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @ApiOperation({ summary: '사용자 데일리 액션(총 회원 수, 오늘 가입자, 오늘 탈퇴자 조회)' })
  @ApiOkResponse({
    type: [DashboardUserDaliyResponse],
  })
  @ApiBearerAuth()
  @Get('users/daily')
  @UseGuards(AuthenticationAdminGuard)
  async getUserDaliyAction() {
    return await this.dashboardsService.getUserDaliyAction();
  }

  @ApiOperation({ summary: '일자별 회원 가입 현황' })
  @ApiOkResponse({
    type: [DashboardUserHistoryResponse],
  })
  @ApiBearerAuth()
  @Get('users/history')
  @UseGuards(AuthenticationAdminGuard)
  async aggregateDailySignups(@Query('start', ParseDatePipe) start: Date, @Query('end', ParseDatePipe) end: Date) {
    return await this.dashboardsService.aggregateDailySignups(start, end);
  }

  @ApiOperation({ summary: '게시글 데일리 액션(오늘 전체 글 조회 수, 등록된 글, 글 마감 수, 글 삭제 수 조회)' })
  @ApiOkResponse({
    type: [DashboardPostDaliyActionResponse],
  })
  @ApiBearerAuth()
  @Get('posts/daily')
  @UseGuards(AuthenticationAdminGuard)
  async getPostDailyAction() {
    return await this.dashboardsService.getPostDailyAction();
  }

  @ApiOperation({ summary: '일자별 게시글 현황' })
  @ApiOkResponse({
    type: [DashboardPostDaliyActionResponse],
  })
  @ApiBearerAuth()
  @Get('posts/history')
  @UseGuards(AuthenticationAdminGuard)
  async getDailyPostStats(@Query('start', ParseDatePipe) start: Date, @Query('end', ParseDatePipe) end: Date) {
    return await this.dashboardsService.getDailyPostStats(start, end);
  }

  @ApiOperation({ summary: '모집글 좋아요 수 집계' })
  @ApiOkResponse({
    type: [DashboardPostLikesResponse],
  })
  @ApiBearerAuth()
  @Get('posts/likes')
  @UseGuards(AuthenticationAdminGuard)
  async getPostTotalLikes() {
    return await this.dashboardsService.getPostTotalLikes();
  }

  @ApiOperation({ summary: '회원 가입 시 선택하는 항목들을 집계' })
  @ApiOkResponse({
    type: [DashboardUserAggregateFieldsResponse],
  })
  @ApiBearerAuth()
  @Get('users/aggregate-fields')
  @UseGuards(AuthenticationAdminGuard)
  async getUserSelectFields() {
    return await this.dashboardsService.getUserSelectFields();
  }

  @ApiOperation({ summary: 'posts/aggregate-fields' })
  @ApiOkResponse({
    type: [DashboardPostAggregateFieldsResponse],
  })
  @ApiBearerAuth()
  @Get('posts/aggregate-fields')
  @UseGuards(AuthenticationAdminGuard)
  async getPostSelectFields() {
    return await this.dashboardsService.getPostSelectFields();
  }
}
