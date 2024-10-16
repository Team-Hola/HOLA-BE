import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Event } from '../schema/event.schema';

export class EventVirtualField {
  @ApiProperty({
    type: Boolean,
    description: '관심 등록 여부',
    example: 'true',
  })
  isLiked: boolean | null;
}

export class EventMainFindResult extends PickType(Event, [
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

export class EventMainListResponse extends IntersectionType(EventMainFindResult, EventVirtualField) {}
