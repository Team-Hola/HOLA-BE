import { PickType } from '@nestjs/swagger';
import { Post } from '../schema/post.schema';

export class CommentListResponse extends PickType(Post, ['comments'] as const) {}
