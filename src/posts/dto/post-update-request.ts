import { PartialType, PickType } from '@nestjs/swagger';
import { Post } from '../schema/post.schema';

export class PostUpdateRequest extends PartialType(
  PickType(Post, [
    'title',
    'content',
    'contactPoint',
    'contactType',
    'expectedPeriod',
    'language',
    'onlineOrOffline',
    'positions',
    'recruits',
    'type',
    'startDate',
    'isDeleted',
    'isClosed',
  ] as const),
) {}
