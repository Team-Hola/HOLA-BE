import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AdvertisementLog } from './schema/advertisement-log.schema';
import { AdLogType } from 'src/CommonCode';

@Injectable()
export class AdvertisementLogsRepository {
  constructor(@InjectModel(AdvertisementLog.name) private advertisementLogModel: Model<AdvertisementLog>) {}

  // 광고 성과 집계
  async findADResult(advertiesmentId: Types.ObjectId) {
    const result = await this.advertisementLogModel
      .aggregate([
        {
          $match: {
            advertisementId: { $in: advertiesmentId },
          },
        },
        {
          $group: {
            _id: {
              advertisementId: '$advertisementId',
              logType: '$logType',
            },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'advertisements',
            localField: '_id.advertisementId',
            foreignField: '_id',
            pipeline: [{ $project: { advertisementType: 1 } }],
            as: 'advertisements',
          },
        },
        { $unwind: '$advertisements' },
      ])
      .sort('advertisements.advertisementType _id.logType');
    return result;
  }

  async create(advertisementId: Types.ObjectId, logType: string) {
    const advertisement = await this.advertisementLogModel.create({
      advertisementId,
      logType,
      logDate: new Date(),
    });
    return advertisement;
  }
}
