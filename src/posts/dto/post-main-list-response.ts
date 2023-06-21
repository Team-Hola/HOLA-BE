import { PostMainFindResult } from '../types/post-main-find-result';

export type PostBadgeType = 'study' | 'project' | 'deadline' | 'new' | 'hot';

export type PostBadge = {
  type: PostBadgeType;
  content: string;
};

export type PostVirtualField = {
  isLiked: boolean | null;
  badge: PostBadge[];
  totalComments: number;
};

export type PostMainListResponse = PostMainFindResult & PostVirtualField;
