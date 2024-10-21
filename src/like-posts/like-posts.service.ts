import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { LikePostsRepository } from './like-posts.repository';

@Injectable()
export class LikePostsService {
  constructor(private readonly likePostsRepository: LikePostsRepository) {}

  async getLikedPostByUserId(userId: Types.ObjectId, offset: number, limit: number) {
    const likedPosts = await this.likePostsRepository.findLikedPostByUserId(userId, offset, limit);
    const result = likedPosts
      .filter((i) => {
        return i.postId && i.postId !== null;
      })
      .map((i) => {
        return i.postId;
      });
    return result;
  }

  async add(postId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likePostsRepository.add(postId, userId);
  }

  async delete(postId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likePostsRepository.delete(postId, userId);
  }

  // 관심 등록 수 집계
  async countLikePosts() {
    return await this.likePostsRepository.countLikePosts();
  }
}
