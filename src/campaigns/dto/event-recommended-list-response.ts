import { PickType } from '@nestjs/swagger';
import { Event } from '../schema/event.schema';

export class EventRecommendedListResponse extends PickType(Event, [
  '_id',
  'title',
  'eventType',
  'imageUrl',
  'smallImageUrl',
  'startDate',
  'endDate',
  'views',
  'place',
  'organization',
  'applicationStartDate',
  'applicationEndDate',
] as const) {}
