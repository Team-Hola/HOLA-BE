import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LikePost } from './schema/like-post.schema';

@Injectable()
export class LikePostsRepository {
  constructor(@InjectModel(LikePost.name) private likePostModel: Model<LikePost>) {}

  async findLikedPostByUserId(userId: Types.ObjectId, offset: number, limit: number) {
    return this.likePostModel
      .find({ userId })
      .skip(offset)
      .limit(limit)
      .populate({
        path: 'postId',
        select: `title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt`,
        match: { isDeleted: false },
        populate: { path: 'author', select: `nickName image` },
      })
      .sort('-createdAt')
      .lean();
  }

  async add(postId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likePostModel.create({
      userId,
      postId,
    });
  }

  async delete(postId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likePostModel.deleteOne({
      userId,
      postId,
    });
  }
}
