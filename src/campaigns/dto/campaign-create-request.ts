import { PickType } from '@nestjs/swagger';
import { Campaign } from '../schema/campaign.schema';

export class CampaignCreateRequest extends PickType(Campaign, [
  'title',
  'companyName',
  'managerName',
  'managerEmail',
  'managerPhone',
  'startDate',
  'endDate',
  'basicAdvertisingFee',
  'conversionType',
  'conversionCost',
  'campaignStatus',
  'expectedImpressions',
  'remark',
] as const) {}
