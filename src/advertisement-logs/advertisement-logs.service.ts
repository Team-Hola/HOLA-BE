import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AdvertisementLogsRepository } from './advertisement-logs.repository';
import { AdLogType } from 'src/CommonCode';

@Injectable()
export class AdvertisementLogsService {
  constructor(private readonly advertisementLogsRepository: AdvertisementLogsRepository) {}

  async createLog(advertisementId: Types.ObjectId, logType: string) {
    await this.advertisementLogsRepository.create(advertisementId, logType);
  }

  async getAdResult(advertiesmentId: Types.ObjectId) {
    const result = this.advertisementLogsRepository.findADResult(advertiesmentId);
    return result;
  }
}
