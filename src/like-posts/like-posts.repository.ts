import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LikePost } from './schema/like-post.schema';

@Injectable()
export class LikePostsRepository {
  constructor(@InjectModel(LikePost.name) private likePostModel: Model<LikePost>) {}

  async findLikedPostByUserId(userId: Types.ObjectId, offset: number, limit: number) {
    const likePosts = await this.likePostModel
      .aggregate([
        { $match: { userId: userId } },
        {
          $lookup: {
            from: 'posts',
            localField: 'postId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  title: 1,
                  views: 1,
                  comments: 1,
                  likes: 1,
                  language: 1,
                  isClosed: 1,
                  totalLikes: 1,
                  startDate: 1,
                  endDate: 1,
                  type: 1,
                  onlineOrOffline: 1,
                  contactType: 1,
                  recruits: 1,
                  expectedPeriod: 1,
                  author: 1,
                  positions: 1,
                  createdAt: 1,
                },
              },
            ],
            as: 'postId',
          },
        },
        {
          $unwind: '$postId',
        },
        {
          $lookup: {
            from: 'users',
            localField: 'postId.author',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 1, nickName: 1, image: 1 } }],
            as: 'postId.author',
          },
        },
      ])
      .sort({
        'postId.createdAt': -1,
      });

    const result = likePosts
      .filter((i) => {
        return i.postId && i.postId !== null;
      })
      .map((i) => {
        return i.postId;
      });
    return result;
    // return this.likePostModel
    //   .find({ userId })
    //   .skip(offset)
    //   .limit(limit)
    //   .populate({
    //     path: 'postId',
    //     select: `title views comments likes language isClosed totalLikes startDate endDate type onlineOrOffline contactType recruits expectedPeriod author positions createdAt`,
    //     match: { isDeleted: false },
    //     populate: { path: 'author', select: `nickName image` },
    //   })
    //   .sort('-createdAt')
    //   .lean();
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
