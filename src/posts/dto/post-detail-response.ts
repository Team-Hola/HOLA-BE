import { IntersectionType } from '@nestjs/swagger';
import { Post } from '../schema/post.schema';
import { PostTopVirtualField } from './post-top-list-response';

export class PostDetailResponse extends IntersectionType(Post, PostTopVirtualField) {}
