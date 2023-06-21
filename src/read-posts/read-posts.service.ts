import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReadPostsRepository } from './read-posts.repository';

@Injectable()
export class ReadPostsService {
  constructor(private readonly readPostsRepository: ReadPostsRepository) {}

  async getReadPostByUser(userId: Types.ObjectId, offset: number, limit: number) {
    const readPosts = await this.readPostsRepository.findReadPostByUserId(userId, offset, limit);
    const result = readPosts
      .filter((i) => {
        return i.postId && i.postId !== null;
      })
      .map((i) => {
        return i.postId;
      });
    return result;
  }

  async create(postId: Types.ObjectId, userId: Types.ObjectId) {
    await this.readPostsRepository.create(postId, userId);
  }
}
