import { PostPOJO } from '../posts.repository';
import { PostBadge } from './post-main-list-response';

export type PostTopVirtualField = {
  badge: PostBadge[];
};

export type PostPOJOTop = Pick<
  PostPOJO,
  'type' | 'startDate' | 'title' | 'language' | 'positions' | 'views' | 'author' | 'likes' | 'comments' | 'createdAt'
>;

export type PostTopListResponse = PostPOJOTop & PostTopVirtualField;
