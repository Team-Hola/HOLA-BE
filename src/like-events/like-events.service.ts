import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { LikeEventsRepository } from './like-events.repository';

@Injectable()
export class LikeEventsService {
  constructor(private readonly likeEventsRepository: LikeEventsRepository) {}

  // 사용자가 관심 등록한 Event 리스트를 조회한다.
  async getLikedEventByUserId(userId: Types.ObjectId) {
    const likedEvents = await this.likeEventsRepository.findLikedEventsByUser(userId);
    return likedEvents;
  }
  // 캘린더에서 사용자가 관심 등록한 Event 리스트를 조회한다.
  async getLikedEventsByCalendar(userId: Types.ObjectId, year: number, month: number) {
    const likedEvents = await this.likeEventsRepository.findLikedEventsByCalendar(userId, year, month);
    return likedEvents;
  }

  async add(eventId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likeEventsRepository.add(eventId, userId);
  }

  async delete(eventId: Types.ObjectId, userId: Types.ObjectId) {
    await this.likeEventsRepository.delete(eventId, userId);
  }
}
