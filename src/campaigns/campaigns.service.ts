import { Injectable, NotFoundException } from '@nestjs/common';
import { CampaignPOJO, CampaignsRepository } from './campaigns.repository';
import { Types } from 'mongoose';
import { GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { CampaignCreateRequest } from './dto/campaign-create-request';

@Injectable()
export class CampaignsService {
  private s3Client: S3Client;

  constructor(private readonly campaignsRepository: CampaignsRepository) {}

  // 리스트뷰 조회
  async getCampaignList(page: number): Promise<CampaignPOJO[]> {
    let campaigns: CampaignPOJO[] = await this.campaignsRepository.findCampaignListInPagination(page);
    return campaigns;
  }

  // 리스트뷰 조회
  async getCampaignDetail(campaignId: Types.ObjectId): Promise<CampaignPOJO> {
    let campaign: CampaignPOJO = await this.campaignsRepository.findByCampaignId(campaignId);
    return campaign;
  }

  async createCampaign(campaign: CampaignCreateRequest) {
    const campaignRecord = await this.campaignsRepository.createCampaign(campaign);
    return campaignRecord;
  }

  async updateCampaign(id: Types.ObjectId, campaign: CampaignCreateRequest) {
    const campaignRecord = await this.campaignsRepository.updateCampaign(id, campaign);
    return campaignRecord;
  }

  async deleteCampaign(id: Types.ObjectId) {
    await this.campaignsRepository.deleteCampaign(id);
  }

  // TODO
  // 캠페인의 광고 리스트 조회
  // async findAdvertisementInCampaign(campaignId: Types.ObjectId) {
  //   return await this.advertisementModel.findAdvertisementInCampaign(campaignId);
  // }

  // // 광고 결과 집계
  // async findCampaignResult(campaignId: Types.ObjectId) {
  //   const campaign = await this.findCampaign(campaignId);
  //   const adList = await this.advertisementModel.findAdvertisementInCampaign(campaignId);
  //   const adIdList = adList.map((ad: any) => {
  //     return Types.ObjectId(ad._id);
  //   });
  //   // 로그 집계
  //   const aggregate = await this.advertisementLogModel.findADResult(adIdList);
  //   const logAggregate = aggregate.map((ad: any) => {
  //     return {
  //       _id: ad._id.advertisementId,
  //       logType: ad._id.logType,
  //       count: ad.count,
  //       advertisementType: ad.advertisements.advertisementType,
  //     };
  //   });
  //   // 광고 성과 형식으로 그룹핑
  //   let result: any = [];
  //   logAggregate.forEach((element: any) => {
  //     let index = result.findIndex((v: any) => (v.advertisementType === element.advertisementType ? true : false));
  //     if (index === -1) {
  //       result.push({
  //         advertisementType: element.advertisementType,
  //         advertisementId: element._id,
  //         [element.logType]: element.count,
  //       });
  //     } else {
  //       result[index] = {
  //         ...result[index],
  //         [element.logType]: element.count,
  //       };
  //     }
  //   });

  //   // 전환비용, 클릭률 세팅
  //   result = result.map((v: any) => {
  //     if (!v.reach || !v.impression) return v;
  //     const reachRate = ((v.reach / v.impression) * 100).toFixed(2) + '%';
  //     const reachPrice = (campaign.conversionCost * v.reach).toFixed(0);
  //     return {
  //       ...v,
  //       reachRate,
  //       reachPrice,
  //     };
  //   });
  //   return result;
  // }
}
