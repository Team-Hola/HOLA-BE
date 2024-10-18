import { AdvertisementDetailResponse } from './dto/advertisement-detail-response';
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
import { AdvertisementsService } from './advertisements.service';
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
import { GetAuthUserGuard } from 'src/auth/guard/get-auth-user.guard';
import { User } from 'src/auth/user.decorator';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/common/pipe/parse-objectid.pipe';
import { AuthenticationGuard } from 'src/auth/guard/authentication.guard';
import { AuthenticationAdminGuard } from 'src/auth/guard/authentication.admin.guard';
import { AdvertisementCreateRequest } from './dto/advertisement-create-request';
import { Advertisement, AdvertisementSchema } from './schema/advertisement.schema';
import { EventGetPresignUrlCondition } from 'src/events/dto/event-get-presign-url-condition';
import { AdvertisementLogCreateRequest } from './dto/advertisement-log-create-request';
import { AdvertisementLogsService } from 'src/advertisement-logs/advertisement-logs.service';

@ApiTags('advertisements')
@Controller('api/advertisements')
export class AdvertisementsController {
  constructor(
    private readonly advertisementsService: AdvertisementsService,
    private readonly advertisementLogsService: AdvertisementLogsService,
  ) {}

  @ApiOperation({ summary: '광고 이미지 S3 Pre-Signed URL 발급' })
  @ApiOkResponse({
    type: [EventGetPresignUrlCondition],
  })
  @Get('pre-sign-url')
  async getPreSignUrl(@Query() dto: EventGetPresignUrlCondition): Promise<string> {
    const { fileName } = dto;
    return await this.advertisementsService.getPreSignUrl(fileName);
  }

  @ApiOperation({ summary: '광고 이벤트 추적 로깅' })
  @ApiCreatedResponse({ type: AdvertisementLogCreateRequest })
  @Post('/event-log')
  @HttpCode(201)
  async createEventLog(@Body() dto: AdvertisementLogCreateRequest) {
    const { advertisementId, logType } = dto;
    return this.advertisementLogsService.createLog(advertisementId, logType);
  }

  @ApiOperation({ summary: ' 진행중인 배너 광고 조회' })
  @ApiOkResponse({
    type: [Advertisement],
  })
  @Get('/banner')
  async getActiveBanner() {
    return await this.advertisementsService.getActiveBanner();
  }

  @ApiOperation({ summary: ' 진행중인 배너 광고 조회' })
  @ApiOkResponse({
    type: [Advertisement],
  })
  @Get('/eventBanner')
  async getActiveEventBanner() {
    return await this.advertisementsService.getActiveEventBanner();
  }

  @ApiOperation({ summary: '광고 상세 보기' })
  @ApiOkResponse({
    type: AdvertisementDetailResponse,
  })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthenticationAdminGuard)
  async getAdvertisementDetail(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return await this.advertisementsService.getADDetail(id);
  }

  @ApiOperation({ summary: '광고 등록' })
  @ApiCreatedResponse({ type: AdvertisementCreateRequest })
  @ApiBearerAuth()
  @UseGuards(AuthenticationAdminGuard)
  @Post()
  @HttpCode(201)
  async createPost(@Body() dto: AdvertisementCreateRequest) {
    return this.advertisementsService.createAdvertisement(dto);
  }

  @ApiOperation({ summary: '광고 수정' })
  @ApiOkResponse({
    type: AdvertisementCreateRequest,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationAdminGuard)
  @Put(':id')
  async updateAdvertisement(
    @Param('id', ParseObjectIdPipe) advertisementId: Types.ObjectId,
    @Body() dto: AdvertisementCreateRequest,
  ) {
    return this.advertisementsService.updateAdvertisement(advertisementId, dto);
  }

  @ApiOperation({ summary: '광고 삭제' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(AuthenticationAdminGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteAdvertisement(@Param('id', ParseObjectIdPipe) advertisementId: Types.ObjectId) {
    await this.advertisementsService.deleteAdvertisement(advertisementId);
  }
}
