import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Notification } from '../schema/notification.schema';

export class NotificationVirtualField {
  @ApiProperty({
    type: String,
    description: '알림 발생 시간',
    example: '~시간 전, ~분 전',
  })
  timeAgo: string;
}

export class NotificationFindResult extends PickType(Notification, [
  'title',
  'isRead',
  'href',
  'createUserId',
  'noticeType',
  'createdAt',
  'icon',
  'buttonLabel',
] as const) {}

export class NotificationListResponse extends IntersectionType(NotificationFindResult, NotificationVirtualField) {}
