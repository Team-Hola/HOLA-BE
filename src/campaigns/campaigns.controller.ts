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
  @Patch(':id')
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

  // TODO
  // #region 캠페인의 광고 리스트 보기
  /**
   * @swagger
   * paths:
   *   /campaigns/{id}/advertisement:
   *    get:
   *      tags:
   *        - 캠페인 관리(어드민)
   *      summary: 캠페인의 광고 리스트 보기
   *      description: '캠페인의 등록된 광고 리스트를 조회한다.'
   *      parameters:
   *        - name: accessToken
   *          in: header
   *          description: access token
   *          required: false
   *          schema:
   *            type: string
   *        - name: id
   *          in: path
   *          description: 캠페인 Id
   *          required: true
   *          example: '635a91e837ad67001412321a'
   *          schema:
   *            type: string
   *      responses:
   *        200:
   *          description: successful operation
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/Advertisement'
   */
  // #endregion
  // route.get(
  //   '/:id/advertisements',
  //   isAccessTokenValidWithAdmin,
  //   asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  //     const campaignId = req.params.id;
  //     const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
  //     const campaign = await CampaignServiceInstance.findAdvertisementInCampaign(campaignId);
  //     return res.status(200).json(campaign);
  //   })
  // );

  // // #region 광고 성과 집계
  // /**
  //  * @swagger
  //  * paths:
  //  *   /campaigns/{id}/result:
  //  *    get:
  //  *      tags:
  //  *        - 캠페인 관리(어드민)
  //  *      summary: 캠페인의 광고 성과 집계
  //  *      description: '광고 성과를 조회한다.'
  //  *      parameters:
  //  *        - name: accessToken
  //  *          in: header
  //  *          description: access token
  //  *          required: false
  //  *          schema:
  //  *            type: string
  //  *        - name: id
  //  *          in: path
  //  *          description: 캠페인 Id
  //  *          required: true
  //  *          example: '635a91e837ad67001412321a'
  //  *          schema:
  //  *            type: string
  //  *      responses:
  //  *        200:
  //  *          description: successful operation
  //  *          content:
  //  *            application/json:
  //  *              schema:
  //  *                type: object
  //  *                properties:
  //  *                  advertisementType:
  //  *                    type: string
  //  *                    description: 광고 유형(banner, event)
  //  *                    example: 'banner'
  //  *                  advertisementId:
  //  *                    type: string
  //  *                    description: 광고 ID
  //  *                    example: '6513fd110c19093e9896c9a2'
  //  *                  impression:
  //  *                    type: number
  //  *                    description: 노출 수
  //  *                    example: 10000
  //  *                  reach:
  //  *                    type: number
  //  *                    description: 클릭 수
  //  *                    example: 2000
  //  *                  reachRate:
  //  *                    type: string
  //  *                    description: 클릭률(%)
  //  *                    example: 20%
  //  *                  reachPrice:
  //  *                    type: number
  //  *                    description: 클릭 비용(클릭 수 * 전환당 단가)
  //  *                    example: 1200000
  //  */
  // // #endregion
  // route.get(
  //   '/:id/result',
  //   isAccessTokenValidWithAdmin,
  //   asyncErrorWrapper(async (req: Request, res: Response, next: NextFunction) => {
  //     const campaignId = req.params.id;
  //     const CampaignServiceInstance = new CampaignService(CampaignModel, AdvertisementModel, AdvertisementLogModel);
  //     const campaign = await CampaignServiceInstance.findCampaignResult(campaignId);
  //     return res.status(200).json(campaign);
  //   })
  // );
}
