import { PostPOJO } from '../posts.repository';

export type PostRecommendedListResponse = Pick<PostPOJO, '_id' | 'title'>;
