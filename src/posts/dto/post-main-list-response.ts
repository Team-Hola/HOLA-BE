import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';
import { Post } from '../schema/post.schema';

export type PostBadgeType = 'study' | 'project' | 'deadline' | 'new' | 'hot';
export class PostBadge {
  @ApiProperty({
    description: '뱃지 종류(deadline, new, host)',
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
    type: Boolean,
    description: '관심 등록 여부',
    example: 'true',
  })
  isLiked: boolean | null;

  @ApiProperty({
    type: PostBadge,
    description: '뱃지',
  })
  badge: PostBadge[];

  @ApiProperty({
    type: Number,
    description: '댓글 수',
    example: '3',
  })
  totalComments: number;
}

export class PostMainFindResult extends PickType(Post, [
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

export class PostMainListResponse extends IntersectionType(PostMainFindResult, PostVirtualField) {}
