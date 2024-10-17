import { Injectable, NotFoundException } from '@nestjs/common';
import { AdvertisementPOJO, AdvertisementsRepository } from './advertisements.repository';
import { Types } from 'mongoose';
import { GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AdvertisementCreateRequest } from './dto/advertisement-create-request';
import { AdvertisementDetailResponse } from './dto/advertisement-detail-response';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AdvertisementsService {
  private s3Client: S3Client;

  constructor(private readonly advertisementsRepository: AdvertisementsRepository) {
    this.s3Client = new S3Client({
      region: process.env.S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  // 진행중인 배너 광고 조회
  async getActiveBanner(): Promise<AdvertisementPOJO[]> {
    let advertisements: AdvertisementPOJO[] = await this.advertisementsRepository.findActiveBannerAds('banner');
    return advertisements;
  }

  // 진행중인 공모전 광고 조회
  async getActiveEventBanner(): Promise<AdvertisementPOJO[]> {
    let advertisements: AdvertisementPOJO[] = await this.advertisementsRepository.findActiveBannerAds('eventBanner');
    return advertisements;
  }

  // 광고 상세 조회
  async getADDetail(advertisementId: Types.ObjectId): Promise<AdvertisementDetailResponse> {
    let ad: any = await this.advertisementsRepository.findByAdvertisementId(advertisementId);

    let result: AdvertisementDetailResponse;
    if (ad.advertisementType === `event` && ad.eventId && ad.eventId._id && ad.eventId.title)
      result = { ...ad, eventId: ad.eventId._id, eventTitle: ad.eventId.title };
    else result = ad;
    return result;
  }

  async createAdvertisement(advertisement: AdvertisementCreateRequest) {
    const advertisementRecord = await this.advertisementsRepository.createAdvertisement(advertisement);
    return advertisementRecord;
  }

  async updateAdvertisement(id: Types.ObjectId, advertisement: AdvertisementCreateRequest) {
    const advertisementRecord = await this.advertisementsRepository.updateAdvertisement(id, advertisement);
    return advertisementRecord;
  }

  async deleteAdvertisement(id: Types.ObjectId) {
    await this.advertisementsRepository.deleteAdvertisement(id);
  }

  // 광고 자동 마감
  async closeExpiredAds() {
    await this.advertisementsRepository.closeExpiredAds();
  }

  // S3 Pre-Sign Url을 발급한다.
  async getPreSignUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `ad/${fileName}`,
    } as GetObjectCommandInput);
    return getSignedUrl(this.s3Client, command, { expiresIn: 60 * 10 });
  }
}
