import { Post } from '../schema/post.schema';

export type PostMainFindResult = Pick<
  Post,
  'type' | 'startDate' | 'title' | 'language' | 'positions' | 'views' | 'author' | 'likes' | 'comments' | 'createdAt'
>;
