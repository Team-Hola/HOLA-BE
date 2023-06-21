import { PickType } from '@nestjs/swagger';
import { Post } from '../schema/post.schema';

export class PostCreateRequest extends PickType(Post, [
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
] as const) {}
