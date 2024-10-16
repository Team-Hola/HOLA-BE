import { PickType } from '@nestjs/swagger';
import { Event } from '../schema/event.schema';

export class EventTitleResponse extends PickType(Event, ['title'] as const) {}
