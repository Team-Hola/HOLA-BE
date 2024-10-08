import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Event } from './schema/event.schema';
import { EventCreateRequest } from './dto/post-create-request';

export type EventPOJO = FlattenMaps<Event>;

@Injectable()
export class EventsRepository {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async createEvent(userId: Types.ObjectId, dto: EventCreateRequest) {
    return this.eventModel.create({
      ...dto,
      author: userId,
    });
  }

  async updateEvent(eventId: Types.ObjectId, dto: EventCreateRequest) {
    return this.eventModel.findByIdAndUpdate(eventId, dto, {
      new: true,
    });
  }

  async deleteEvent(eventId: Types.ObjectId) {
    await this.eventModel.findOneAndUpdate({ _id: eventId }, { isDeleted: true });
  }

  private createQueryInFindMain(
    eventType: string | null,
    onOffLine: string | null,
    isClosed: boolean | null,
    search: string | null,
  ) {
    const query: any = {};

    if (typeof onOffLine === 'string' && onOffLine && onOffLine.toUpperCase() != 'ALL')
      query.onlineOrOffline = onOffLine;

    if (isClosed != null) query.isClosed = { $eq: isClosed };
    query.isDeleted = { $eq: false };

    // 공모전 구분(conference, hackathon, contest, bootcamp, others)
    if (typeof eventType === 'string' && eventType && eventType.toUpperCase() != 'ALL') {
      query.eventType = { $eq: eventType };
    }

    const aggregateSearch = [];
    if (search) {
      aggregateSearch.push({
        // text search index
        $search: {
          index: 'events_text_search',
          text: {
            query: search,
            path: {
              wildcard: '*',
            },
          },
        },
      });
    }
    return {
      query,
      aggregateSearch,
    };
  }

  async findMainList(
    page: number = 1,
    language: string[] | null,
    isClosed: boolean = false,
    type: string | null,
    position: string | null,
    search: string | null,
    onOffLine: string | null,
  ): Promise<PostMainFindResult[]> {
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    const pageToSkip = (page - 1) * itemsPerPage;

    const { query, aggregateSearch } = this.createQueryInFindMain(
      language,
      isClosed,
      type,
      position,
      search,
      onOffLine,
    );
    const aggregate = [
      ...aggregateSearch,
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          pipeline: [{ $project: { _id: 1, nickName: 1, image: 1 } }],
          as: 'author',
        },
      },
      {
        $project: {
          type: 1,
          startDate: 1,
          title: 1,
          language: 1,
          positions: 1,
          comments: 1,
          views: 1,
          author: 1,
          likes: 1,
          createdAt: 1,
          isClosed: 1,
          totalLikes: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ];

    // 텍스트 검색 시 score 2 이상 적용
    if (search && typeof search === 'string') {
      aggregate.push({
        $match: {
          score: {
            $gte: 0.5,
          },
        },
      });
    }
    const posts = await this.postModel.aggregate(aggregate).sort('-createdAt').skip(pageToSkip).limit(itemsPerPage);
    // author array to object
    const result = posts.map((post: any) => {
      if (post.author.length > 0) post.author = post.author[post.author.length - 1];
      return post;
    });

    return result;
  }
}
