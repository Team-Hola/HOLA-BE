import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { PostPOJO } from '../posts.repository';
import { Post } from '../schema/post.schema';
import { PostBadge } from './post-main-list-response';

export class PostTopVirtualField {
  @ApiProperty({
    type: PostBadge,
    description: '뱃지',
  })
  badge: PostBadge[];
}

export class PostPOJOTop extends PickType(Post, [
  'type',
  'startDate',
  'title',
  'language',
  'positions',
  'views',
  'author',
  'likes',
  'comments',
  'createdAt',
] as const) {}

export class PostTopListResponse extends IntersectionType(PostPOJOTop, PostTopVirtualField) {}
