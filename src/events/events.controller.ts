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
import { EventsService } from './events.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventMainListResponse } from './dto/event-main-list-response';
import { GetAuthUserGuard } from 'src/auth/guard/get-auth-user.guard';
import { User } from 'src/auth/user.decorator';
import { EventMainGetCondition } from './dto/event-main-get-condition';
import { Types } from 'mongoose';
import { EventTitleResponse } from './dto/event-title-response';
import { EventGetPresignUrlCondition } from './dto/event-get-presign-url-condition';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-objectid.pipe';
import { EventRecommendedListResponse } from './dto/event-recommended-list-response';
import { EventGetRecommendedCondition } from './dto/event-get-recommended-condition';
import { Event as EventSchema } from './schema/event.schema';
import { AuthenticationGuard } from 'src/auth/guard/authentication.guard';
import { EventCreateRequest } from './dto/event-create-request';
import { LikeUserGetResponse } from './dto/like-user-get-response';
import { LikeAddRequest } from './dto/like-add-request';

@ApiTags('events')
@Controller('api/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @ApiOperation({ summary: '공모전 리스트 조회(Pagination)' })
  @ApiOkResponse({
    type: [EventMainListResponse],
  })
  @ApiBearerAuth()
  @Get()
  @UseGuards(GetAuthUserGuard)
  async getEventList(
    @User('_id') userId: string | null,
    @Query() dto: EventMainGetCondition,
  ): Promise<EventMainListResponse[]> {
    const { page, sort, eventType, search, onOffLine } = dto;
    return await this.eventsService.getMainList(page, sort, eventType, search, onOffLine, new Types.ObjectId(userId));
  }
  @ApiOperation({ summary: '공모전 페이지네이션 마지막 페이지 조회' })
  @ApiBody({
    schema: {
      properties: {
        lastPage: { type: 'numer', example: 15, description: '마지막 페이지' },
      },
    },
  })
  @Get('/last-page')
  async getEventLastPage(@Query() dto: EventMainGetCondition) {
    const { eventType, search, onOffLine } = dto;
    const lastPage: number = await this.eventsService.getEventLastPage(eventType, search, onOffLine);
    return {
      lastPage,
    };
  }

  @ApiOperation({ summary: '공모전 캘린더뷰 조회' })
  @ApiOkResponse({
    type: [EventMainListResponse],
  })
  @ApiBearerAuth()
  @Get('/calendar/:year/:month')
  @UseGuards(GetAuthUserGuard)
  async getEventListInCalendar(
    @User('_id') userId: string | null,
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Query() dto: EventMainGetCondition,
  ): Promise<EventMainListResponse[]> {
    const { eventType, search, onOffLine } = dto;
    return await this.eventsService.getEventListInCalendar(
      year,
      month,
      eventType,
      search,
      new Types.ObjectId(userId),
      onOffLine,
    );
  }

  @ApiOperation({ summary: '진행중인 모든 공모전 조회(SelectBox 전용)' })
  @ApiOkResponse({
    type: [EventTitleResponse],
  })
  @Get('bulk')
  async getEventTitleList(): Promise<EventTitleResponse[]> {
    return await this.eventsService.getEventTitleList();
  }

  @ApiOperation({ summary: '공모전 이미지 S3 Pre-Signed URL 발급' })
  @ApiOkResponse({
    type: [EventGetPresignUrlCondition],
  })
  @Get('pre-sign-url')
  async getPreSignUrl(@Query() dto: EventGetPresignUrlCondition): Promise<string> {
    const { fileName } = dto;
    return await this.eventsService.getPreSignUrl(fileName);
  }

  @ApiOperation({ summary: '공모전 상세 보기' })
  @ApiOkResponse({
    type: EventMainListResponse,
  })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(GetAuthUserGuard)
  async getEventDetail(
    @User('_id') userId: string | null,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<EventMainListResponse> {
    return await this.eventsService.getEvent(id, new Types.ObjectId(userId));
  }

  @ApiOperation({ summary: '공모전 상세에서 관련 공모전 추천' })
  @ApiOkResponse({
    type: [EventRecommendedListResponse],
  })
  @ApiBearerAuth()
  @Get(':id/recommended')
  @UseGuards(GetAuthUserGuard)
  async getRecommendedPostList(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query() dto: EventGetRecommendedCondition,
  ): Promise<EventRecommendedListResponse[]> {
    const { eventType } = dto;
    return await this.eventsService.getRecommendEventListInDetail(id, eventType);
  }

  @ApiOperation({ summary: '공모전 등록' })
  @ApiCreatedResponse({ type: EventSchema })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @HttpCode(201)
  async createPost(@Body() dto: EventCreateRequest) {
    return this.eventsService.createEvent(dto);
  }

  @ApiOperation({ summary: '공모전 수정' })
  @ApiOkResponse({
    type: EventSchema,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put(':id')
  async updateEvent(
    @User('_id') userId: string,
    @User('tokenType') tokenType: string,
    @Param('id', ParseObjectIdPipe) eventId: Types.ObjectId,
    @Body() dto: EventCreateRequest,
  ) {
    return this.eventsService.updateEvent(eventId, dto);
  }

  @ApiOperation({ summary: '공모전 삭제' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteEvent(
    @User('_id') userId: string,
    @User('tokenType') tokenType: string,
    @Param('id', ParseObjectIdPipe) eventId: Types.ObjectId,
  ) {
    await this.eventsService.deleteEvent(eventId);
  }

  @ApiOperation({ summary: '공모전 관심 등록' })
  @ApiCreatedResponse({
    type: LikeUserGetResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('likes')
  @HttpCode(201)
  async addLike(@User('_id') userId: string | null, @Body() dto: LikeAddRequest) {
    const { eventId } = dto;
    const likes = await this.eventsService.addLike(eventId, new Types.ObjectId(userId));
    return {
      likeUsers: likes,
    };
  }

  @ApiOperation({ summary: '공모전 관심 등록 삭제' })
  @ApiOkResponse({
    type: LikeUserGetResponse,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete('likes/:id')
  @HttpCode(200)
  async deleteLike(@Param('id', ParseObjectIdPipe) eventId: Types.ObjectId, @User('_id') userId: string) {
    const likes = await this.eventsService.deleteLike(eventId, new Types.ObjectId(userId));
    return {
      likeUsers: likes,
    };
  }

  // TODO
  // #region 추천 공모전
  /**
   * @swagger
   * paths:
   *   /events/recommend:
   *    get:
   *      tags:
   *        - 공모전
   *      summary: 추천 공모전 조회(AD)
   *      description: 추천 공모전을 조회한다.
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                type: array
   *                items:
   *                  $ref: '#/components/schemas/RecommendedEvent'
   */
  // #endregion
  // route.get(
  //   '/recommend',
  //   asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  //     const EventServiceInstance = new EventService(EventModel, AdvertisementModel);
  //     const events = await EventServiceInstance.findRecommendEventList();
  //     return res.status(200).json(events);
  //   })
  // );
}
