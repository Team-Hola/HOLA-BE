import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ReadPost } from './schema/read-post.schema';

@Injectable()
export class ReadPostsRepository {
  constructor(@InjectModel(ReadPost.name) private readPostModel: Model<ReadPost>) {}

  async findReadPostByUserId(userId: Types.ObjectId, offset: number, limit: number) {
    return this.readPostModel
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

  async create(postId: Types.ObjectId, userId: Types.ObjectId) {
    await this.readPostModel.updateOne(
      { postId, userId },
      {
        $setOnInsert: {
          userId,
          postId,
        },
      },
      { upsert: true },
    );
  }
}
