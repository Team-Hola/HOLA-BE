import { PickType } from '@nestjs/swagger';
import { Event } from '../schema/event.schema';

export class EventCreateRequest extends PickType(Event, [
  'title',
  'content',
  'eventType',
  'onlineOrOffline',
  'place',
  'organization',
  'link',
  'imageUrl',
  'startDate',
  'endDate',
  'applicationStartDate',
  'applicationEndDate',
  'closeDate',
  'isDeleted',
  'isClosed',
  'description',
  'isFree',
  'price',
] as const) {}
