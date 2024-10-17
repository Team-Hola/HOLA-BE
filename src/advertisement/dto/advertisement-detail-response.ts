import { ApiProperty, IntersectionType, OmitType, PickType } from '@nestjs/swagger';
import { Advertisement } from '../schema/advertisement.schema';

class EventField {
  @ApiProperty({
    type: String,
    description: '이벤트 id',
    example: '12489hjahsjkdhf91y3',
  })
  eventId: string;

  @ApiProperty({
    type: String,
    description: '이벤트 제목',
    example: 'hola 페스타!',
  })
  eventTitle: string;
}

class ADClass extends OmitType(Advertisement, [] as const) {}

// export type AdvertisementDetailResponse = AdvertisementPOJO & EventField;

export class AdvertisementDetailResponse extends IntersectionType(ADClass, EventField) {}
