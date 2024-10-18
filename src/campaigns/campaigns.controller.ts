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
import { CampaignsService } from './campaigns.service';
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
import { CampaignCreateRequest } from './dto/campaign-create-request';
import { Campaign, CampaignSchema } from './schema/campaign.schema';
import { CampaignResultResponse } from './dto/campaign-result-response';

@ApiTags('campaigns')
@Controller('api/campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @ApiOperation({ summary: '캠페인 리스트 조회(Pagination)' })
  @ApiOkResponse({
    type: [Campaign],
  })
  @ApiQuery({ name: 'page', required: true, type: Number, description: 'Page number' })
  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthenticationAdminGuard)
  async getCampaignList(@Query('page', ParseIntPipe) page: number) {
    return await this.campaignsService.getCampaignList(page);
  }

  @ApiOperation({ summary: '캠페인 상세 보기' })
  @ApiBody({
    schema: {
      properties: {
        lastPage: { type: 'numer', example: 15, description: '마지막 페이지' },
      },
    },
  })
  @ApiOperation({ summary: '캠페인 상세 보기' })
  @ApiOkResponse({
    type: Campaign,
  })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthenticationAdminGuard)
  async getCampaignDetail(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return await this.campaignsService.getCampaignDetail(id);
  }

  @ApiOperation({ summary: '캠페인 등록' })
  @ApiCreatedResponse({ type: CampaignCreateRequest })
  @ApiBearerAuth()
  @UseGuards(AuthenticationAdminGuard)
  @Post()
  @HttpCode(201)
  async createPost(@Body() dto: CampaignCreateRequest) {
    return this.campaignsService.createCampaign(dto);
  }

  @ApiOperation({ summary: '캠페인 수정' })
  @ApiOkResponse({
    type: CampaignCreateRequest,
  })
  @ApiBearerAuth()
  @UseGuards(AuthenticationAdminGuard)
  @Put(':id')
  async updateCampaign(@Param('id', ParseObjectIdPipe) campaignId: Types.ObjectId, @Body() dto: CampaignCreateRequest) {
    return this.campaignsService.updateCampaign(campaignId, dto);
  }

  @ApiOperation({ summary: '캠페인 삭제' })
  @ApiNoContentResponse()
  @ApiBearerAuth()
  @UseGuards(AuthenticationAdminGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteCampaign(@Param('id', ParseObjectIdPipe) campaignId: Types.ObjectId) {
    await this.campaignsService.deleteCampaign(campaignId);
  }

  @ApiOperation({ summary: '캠페인의 광고 리스트 보기' })
  @ApiOkResponse({
    type: Campaign,
  })
  @ApiBearerAuth()
  @Get(':id/advertisements')
  @UseGuards(AuthenticationAdminGuard)
  async getAdvertisementInCampaign(@Param('id', ParseObjectIdPipe) campaignId: Types.ObjectId) {
    return await this.campaignsService.getAdsByCampaignId(campaignId);
  }

  @ApiOperation({ summary: '광고 성과 집계' })
  @ApiOkResponse({
    type: CampaignResultResponse,
  })
  @ApiBearerAuth()
  @Get(':id/result')
  @UseGuards(AuthenticationAdminGuard)
  async getCampaignResult(@Param('id', ParseObjectIdPipe) campaignId: Types.ObjectId) {
    return await this.campaignsService.getCampaignResult(campaignId);
  }
}
