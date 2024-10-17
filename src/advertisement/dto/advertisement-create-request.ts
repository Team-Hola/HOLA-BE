import { PickType } from '@nestjs/swagger';
import { Advertisement } from '../schema/advertisement.schema';

export class AdvertisementCreateRequest extends PickType(Advertisement, [
  'campaignId',
  'advertisementType',
  'startDate',
  'endDate',
  'advertisementStatus',
  'link',
  'imageUrl',
  'mainCopy',
  'subCopy',
  'eventId',
] as const) {}
