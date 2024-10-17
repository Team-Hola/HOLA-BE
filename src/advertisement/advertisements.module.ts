import { Module } from '@nestjs/common';
import { AdvertisementsService } from './advertisements.service';
import { AdvertisementsController } from './advertisements.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Advertisement, AdvertisementSchema } from './schema/advertisement.schema';
import { AdvertisementsRepository } from './advertisements.repository';
import { JwtModule } from 'src/jwt/jwt.module';
import { AdvertisementLogsModule } from 'src/advertisement-logs/advertisement-logs.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Advertisement.name, schema: AdvertisementSchema }]),
    JwtModule,
    AdvertisementLogsModule,
  ],
  controllers: [AdvertisementsController],
  providers: [AdvertisementsService, AdvertisementsRepository],
  exports: [AdvertisementsService],
})
export class AdvertisementsModule {}
