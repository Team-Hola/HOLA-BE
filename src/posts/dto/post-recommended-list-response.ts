import { PickType } from '@nestjs/swagger';
import { Post } from '../schema/post.schema';

export class PostRecommendedListResponse extends PickType(Post, ['_id', 'title'] as const) {}
