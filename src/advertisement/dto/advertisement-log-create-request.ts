import { PickType } from '@nestjs/swagger';
import { AdvertisementLog } from 'src/advertisement-logs/schema/advertisement-log.schema';

export class AdvertisementLogCreateRequest extends PickType(AdvertisementLog, [
  'advertisementId',
  'logType',
] as const) {}
