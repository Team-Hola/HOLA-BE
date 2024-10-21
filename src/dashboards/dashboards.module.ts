import { Module } from '@nestjs/common';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from 'src/jwt/jwt.module';
import { AdvertisementsModule } from 'src/advertisement/advertisements.module';
import { AdvertisementLogsModule } from 'src/advertisement-logs/advertisement-logs.module';

@Module({
  imports: [JwtModule, AdvertisementsModule, AdvertisementLogsModule],
  controllers: [DashboardsController],
  providers: [DashboardsService],
  exports: [DashboardsService],
})
export class DashboardsModule {}
