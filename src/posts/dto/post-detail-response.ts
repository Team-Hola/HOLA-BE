import { PostPOJO } from '../posts.repository';
import { PostTopVirtualField } from './post-top-list-response';

export type PostDetailResponse = PostPOJO & PostTopVirtualField;
