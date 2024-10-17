import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Advertisement } from './schema/advertisement.schema';
import { AdvertisementCreateRequest } from './dto/advertisement-create-request';
import { AdType } from 'src/CommonCode';

export type AdvertisementPOJO = FlattenMaps<Advertisement>;

@Injectable()
export class AdvertisementsRepository {
  constructor(@InjectModel(Advertisement.name) private advertisementModel: Model<Advertisement>) {}

  async findByAdvertisementId(advertisementId: Types.ObjectId): Promise<AdvertisementPOJO> {
    return await this.advertisementModel.findById(advertisementId).populate('eventId', 'title').lean();
  }

  async findByEventId(eventId: Types.ObjectId): Promise<AdvertisementPOJO> {
    return await this.advertisementModel.findById({ eventId }).lean();
  }

  async findByAdType(campaignId: Types.ObjectId, advertisementType: AdType): Promise<AdvertisementPOJO> {
    return await this.advertisementModel.findById({ campaignId, advertisementType }).lean();
  }

  async findRandomActiveAd() {
    return await this.advertisementModel.aggregate([
      { $match: { advertisementType: 'event', advertisementStatus: 'active' } },
      { $sample: { size: 2 } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                eventType: 1,
                imageUrl: 1,
                smallImageUrl: 1,
                startDate: 1,
                endDate: 1,
                views: 1,
                place: 1,
                organization: 1,
                applicationStartDate: 1,
                applicationEndDate: 1,
              },
            },
          ],
          as: 'event',
        },
      },
      {
        $project: { event: 1 },
      },
    ]);
  }

  // 진행중인 배너 광고 조회
  async findActiveBannerAds(bannerType: 'banner' | 'eventBanner') {
    return await this.advertisementModel
      .find({ advertisementType: bannerType, advertisementStatus: 'active' })
      .sort({ bannerSequence: 1 })
      .select('link linkOpenType imageUrl smallImageUrl mainCopy subCopy bannerSequence startDate endDate')
      .lean();
  }
  // 캠페인의 광고 리스트 조회
  async findCampaignAdsList(campaignId: Types.ObjectId) {
    return await this.advertisementModel
      .find({ campaignId })
      .select(`advertisementType startDate endDate advertisementStatus`)
      .lean();
  }

  async createAdvertisement(dto: AdvertisementCreateRequest) {
    return this.advertisementModel.create(dto);
  }

  async updateAdvertisement(advertisementId: Types.ObjectId, dto: AdvertisementCreateRequest) {
    return this.advertisementModel.findByIdAndUpdate(advertisementId, dto, {
      new: true,
    });
  }

  async deleteAdvertisement(advertisementId: Types.ObjectId) {
    await this.advertisementModel.findByIdAndDelete(advertisementId);
  }

  // 광고 진행 기간이 지난글 자동 마감
  async closeExpiredAds() {
    const today = new Date();
    await this.advertisementModel.updateMany(
      { $and: [{ advertisementStatus: 'active' }, { endDate: { $lte: today } }] },
      { advertisementStatus: 'close' },
    );
  }
}
