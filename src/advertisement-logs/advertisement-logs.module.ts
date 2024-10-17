import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdvertisementLogsService } from './advertisement-logs.service';
import { AdvertisementLog, AdvertisementLogSchema } from './schema/advertisement-log.schema';
import { AdvertisementLogsRepository } from './advertisement-logs.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: AdvertisementLog.name, schema: AdvertisementLogSchema }])],
  providers: [AdvertisementLogsService, AdvertisementLogsRepository],
  exports: [AdvertisementLogsService],
})
export class AdvertisementLogsModule {}
