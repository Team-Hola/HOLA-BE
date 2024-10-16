import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from './schema/campaign.schema';
import { CampaignsRepository } from './campaigns.repository';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Campaign.name, schema: CampaignSchema }]), JwtModule],
  controllers: [CampaignsController],
  providers: [CampaignsService, CampaignsRepository],
  exports: [CampaignsService],
})
export class CampaignsModule {}
