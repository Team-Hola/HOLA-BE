import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Event } from './schema/event.schema';
import { EventCreateRequest } from './dto/event-create-request';
import { EventTitleResponse } from './dto/event-title-response';
import { EventRecommendedListResponse } from './dto/event-recommended-list-response';
import { EventAddLikeResponse } from './dto/event-add-like-response';

export type EventPOJO = FlattenMaps<Event>;

@Injectable()
export class EventsRepository {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async createEvent(dto: EventCreateRequest, smallImageUrl: string) {
    return this.eventModel.create({
      ...dto,
      smallImageUrl,
    });
  }

  async updateEvent(eventId: Types.ObjectId, dto: EventCreateRequest, smallImageUrl: string) {
    return this.eventModel.findByIdAndUpdate(
      eventId,
      { ...dto, smallImageUrl },
      {
        new: true,
      },
    );
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
    sort: string | null,
    eventType: string | null,
    search: string | null,
    onOffLine: string | null,
  ): Promise<EventPOJO[]> {
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    let pageToSkip = 0;
    if (page > 0) pageToSkip = (Number(page) - 1) * itemsPerPage;
    let sortQuery = [];
    // Sorting
    if (sort) {
      const sortableColumns = ['views', 'createdAt'];
      sortQuery = sort.split(',').filter((value: string) => {
        return sortableColumns.indexOf(value.substr(1, value.length)) !== -1 || sortableColumns.indexOf(value) !== -1;
      });
      sortQuery.push('-createdAt');
    } else {
      sortQuery.push('-createdAt');
    }
    const { query, aggregateSearch } = this.createQueryInFindMain(eventType, onOffLine, null, search);
    const aggregate = [...aggregateSearch, { $match: query }];

    const events = await this.eventModel
      .aggregate(aggregate)
      .sort(sortQuery.join(' '))
      .skip(pageToSkip)
      .limit(itemsPerPage);

    return events;
  }

  async findMainListInCalendar(
    year: number,
    month: number,
    eventType: string | null,
    search: string | null,
    onOffLine: string | null,
  ): Promise<EventPOJO[]> {
    const { query, aggregateSearch } = this.createQueryInFindMain(eventType, onOffLine, null, search);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month);
    query.startDate = { $gte: firstDay, $lte: lastDay };
    const aggregate = [...aggregateSearch, { $match: query }];
    const events = await this.eventModel.aggregate(aggregate).sort('startDate');
    return events;
  }

  async findMainLastPage(eventType, onOffLine, search) {
    const { query, aggregateSearch } = this.createQueryInFindMain(eventType, onOffLine, null, search);
    const aggregate = [
      ...aggregateSearch,
      { $match: query },
      {
        $project: {
          title: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ];
    aggregate.push({
      $count: 'eventCount',
    });
    const result: any = await this.eventModel.aggregate(aggregate);
    if (result && result.length > 0) return result[0].eventCount;
    else return 0;
  }

  async increaseView(eventId: Types.ObjectId) {
    await this.eventModel.findByIdAndUpdate(eventId, {
      $inc: {
        views: 1,
      },
    });
  }

  async findTitleListForSelectBox(limit: number): Promise<EventTitleResponse[]> {
    const query = this.createQueryInFindMain(null, null, false, null); // 조회 query 생성
    const events = await this.eventModel.find(query).select('_id title').sort('-createdAt').limit(limit).lean();
    return events;
  }

  async findRecommendedEventList(notInEventId: Types.ObjectId[]): Promise<EventRecommendedListResponse[]> {
    let { query } = this.createQueryInFindMain(null, null, false, null); // 조회 query 생성
    query._id = { $nin: notInEventId };
    let limit = 10 - notInEventId.length;
    const today = new Date();
    query.startDate = { $gte: today.setDate(today.getDate() - 180) };

    const events = await this.eventModel
      .find(query)
      .select(
        '_id title eventType imageUrl smallImageUrl startDate endDate views place organization applicationStartDate applicationEndDate',
      )
      .sort('-views')
      .limit(limit)
      .lean();
    return events;
  }

  async findByEventId(eventId: Types.ObjectId): Promise<EventPOJO> {
    return await this.eventModel.findById(eventId).lean();
  }

  async getRandomEventByType(
    notInEventId: Types.ObjectId[],
    eventType: string | null,
    size: number,
  ): Promise<EventRecommendedListResponse[]> {
    let { query } = this.createQueryInFindMain(eventType, null, false, null); // 조회 query 생성
    query._id = { $nin: notInEventId };
    // TODO 기간 조건 추가

    const event = await this.eventModel.aggregate([{ $match: query }, { $sample: { size: size } }]);
    return event;
  }

  // 신청기간이 지난글 자동 마감
  async updateClosedAfterEndDate() {
    const today = new Date();
    await this.eventModel.updateMany(
      { $and: [{ isClosed: false }, { applicationEndDate: { $lte: today } }] },
      { isClosed: true },
    );
  }

  // 관심등록 추가
  // 디바운스 실패 경우를 위해 예외처리
  async addLike(eventId: Types.ObjectId, userId: Types.ObjectId): Promise<EventAddLikeResponse> {
    const event: EventPOJO[] = await this.eventModel.find({ _id: eventId, likes: { $in: [userId] } }).lean();
    const isLikeExist = event.length > 0;
    let result: EventPOJO;

    if (!isLikeExist) {
      result = await this.eventModel.findByIdAndUpdate(
        { _id: eventId },
        {
          $push: {
            likes: {
              _id: userId,
            },
          },
          $inc: {
            totalLikes: 1,
          },
        },
        {
          new: true,
          upsert: true,
        },
      );
    } else {
      result = event[event.length - 1];
    }
    return { event: result, isLikeExist };
  }

  // 관심 등록 삭제
  async deleteLike(eventId: Types.ObjectId, userId: Types.ObjectId): Promise<EventAddLikeResponse> {
    const events: EventPOJO[] = await this.eventModel.find({ _id: eventId }).lean();
    let event: EventPOJO | null = events[events.length - 1];
    const isLikeExist = event && event.likes.indexOf(userId) > -1;
    if (isLikeExist) {
      event = await this.eventModel.findOneAndUpdate(
        { _id: eventId },
        {
          $pull: { likes: userId },
          $inc: {
            totalLikes: -1,
          },
        },
        {
          new: true,
        },
      );
    }
    return { event, isLikeExist };
  }
}
