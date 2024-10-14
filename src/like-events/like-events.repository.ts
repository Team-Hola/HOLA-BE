import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LikeEvent } from './schema/like-event.schema';

@Injectable()
export class LikeEventsRepository {
  constructor(@InjectModel(LikeEvent.name) private likeEventModel: Model<LikeEvent>) {}

  async add(eventId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likeEventModel.create({
      userId,
      eventId,
    });
  }

  async delete(eventId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likeEventModel.deleteOne({
      userId,
      eventId,
    });
  }

  // 사용자가 관심 등록한 글 리스트를 조회한다.
  async findLikedEventsByUser(id: Types.ObjectId) {
    const likeEvents = await this.likeEventModel.aggregate([
      { $match: { userId: id } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'events',
          localField: 'eventId',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                title: 1,
                views: 1,
                likes: 1,
                content: 1,
                organization: 1,
                onlineOrOffline: 1,
                imageUrl: 1,
                smallImageUrl: 1,
                isDeleted: 1,
                isClosed: 1,
                startDate: 1,
                endDate: 1,
                applicationStartDate: 1,
                applicationEndDate: 1,
                author: 1,
                price: 1,
                place: 1,
                eventType: 1,
              },
            },
          ],
          as: 'eventId',
        },
      },
      {
        $unwind: '$eventId',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'eventId.author',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, nickName: 1, image: 1 } }],
          as: 'eventId.author',
        },
      },
    ]);
    const result = likeEvents
      .filter((i) => {
        return i.eventId && i.eventId !== null;
      })
      .map((i) => {
        return i.eventId;
      });
    return result;
  }

  // 사용자가 관심 등록한 글 리스트를 조회한다.
  async findLikedEventsByCalendar(id: Types.ObjectId, year: number, month: number) {
    const firstDay = new Date(Number(year), Number(month) - 1, 1);
    const lastDay = new Date(Number(year), Number(month));
    const likeEvents = await this.likeEventModel
      .aggregate([
        { $match: { userId: id } },
        {
          $lookup: {
            from: 'events',
            localField: 'eventId',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  title: 1,
                  views: 1,
                  likes: 1,
                  content: 1,
                  organization: 1,
                  onlineOrOffline: 1,
                  imageUrl: 1,
                  smallImageUrl: 1,
                  isDeleted: 1,
                  isClosed: 1,
                  startDate: 1,
                  endDate: 1,
                  applicationStartDate: 1,
                  applicationEndDate: 1,
                  author: 1,
                  price: 1,
                  place: 1,
                  eventType: 1,
                },
              },
            ],
            as: 'eventId',
          },
        },
        {
          $unwind: '$eventId',
        },
        { $match: { 'eventId.startDate': { $gte: firstDay, $lte: lastDay } } },
        {
          $lookup: {
            from: 'users',
            localField: 'eventId.author',
            foreignField: '_id',
            pipeline: [{ $project: { _id: 1, nickName: 1, image: 1 } }],
            as: 'eventId.author',
          },
        },
      ])
      .sort({
        'eventId.createdAt': -1,
      });
    const result = likeEvents
      .filter((i) => {
        return i.eventId && i.eventId !== null;
      })
      .map((i) => {
        return i.eventId;
      });
    return result;
  }
}
