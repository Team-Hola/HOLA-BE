import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Notification } from '../schema/notification.schema';

export type PostBadgeType = 'study' | 'project' | 'deadline' | 'new' | 'hot';
export class PostBadge {
  @ApiProperty({
    description: '뱃지 종류(deadline, new, hot)',
    example: 'deadline',
  })
  type: PostBadgeType;
  @ApiProperty({
    description: '내용',
    example: '마감 6일전',
  })
  content: string;
}

export class PostVirtualField {
  @ApiProperty({
    type: String,
    description: '~시간 전 표기',
    example: '2시간 전',
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

export class NotificationRecentListResponse extends IntersectionType(NotificationFindResult, PostVirtualField) {}
