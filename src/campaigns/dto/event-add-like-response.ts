import { EventPOJO } from './../events.repository';
import { Event } from '../schema/event.schema';

export type EventAddLikeResponse = {
  event: EventPOJO;
  isLikeExist: boolean;
};
