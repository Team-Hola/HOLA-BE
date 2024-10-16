import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Campaign } from './schema/campaign.schema';
import { CampaignCreateRequest } from './dto/campaign-create-request';

export type CampaignPOJO = FlattenMaps<Campaign>;

@Injectable()
export class CampaignsRepository {
  constructor(@InjectModel(Campaign.name) private campaignModel: Model<Campaign>) {}

  async findByCampaignId(campaignId: Types.ObjectId): Promise<CampaignPOJO> {
    return await this.campaignModel.findById(campaignId).lean();
  }

  // 캠페인 목록 조회(Pagination)
  async findCampaignListInPagination(page: number): Promise<CampaignPOJO[]> {
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    let pageToSkip = 0;
    pageToSkip = (page - 1) * itemsPerPage;
    return await this.campaignModel.find().sort('-createdAt').skip(pageToSkip).limit(Number(itemsPerPage)).lean();
  }

  async createCampaign(dto: CampaignCreateRequest) {
    return this.campaignModel.create(dto);
  }

  async updateCampaign(campaignId: Types.ObjectId, dto: CampaignCreateRequest) {
    return this.campaignModel.findByIdAndUpdate(campaignId, dto, {
      new: true,
    });
  }

  async deleteCampaign(campaignId: Types.ObjectId) {
    await this.campaignModel.findByIdAndDelete(campaignId);
  }
}
