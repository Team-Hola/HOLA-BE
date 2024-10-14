import { Injectable, NotFoundException } from '@nestjs/common';
import { EventPOJO, EventsRepository } from './events.repository';
import { LikeEventsService } from 'src/like-events/like-events.service';
import { Types } from 'mongoose';
import { EventMainListResponse } from './dto/event-main-list-response';
import { EventTitleResponse } from './dto/event-title-response';
import { EventCreateRequest } from './dto/event-create-request';
import { GetObjectCommand, GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { EventRecommendedListResponse } from './dto/event-recommended-list-response';

@Injectable()
export class EventsService {
  private s3Client: S3Client;

  constructor(
    private readonly eventsRepository: EventsRepository,
    private readonly likeEventsService: LikeEventsService,
  ) {
    this.s3Client = new S3Client({
      region: process.env.S3_BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  // 리스트뷰 조회
  async getMainList(
    page: number,
    sort: string | null,
    eventType: string | null,
    search: string | null,
    onOffLine: string | null,
    userId: Types.ObjectId | null,
  ): Promise<EventMainListResponse[]> {
    let events: EventPOJO[] = await this.eventsRepository.findMainList(page, sort, eventType, search, onOffLine);
    const result: EventMainListResponse[] = this.addPostVirtualField(events, userId);
    return result;
  }

  // mongoose virtual field 추가
  addPostVirtualField(events: EventPOJO[], userId: Types.ObjectId | null): EventMainListResponse[] {
    let result = [];
    // 글 상태
    result = events.map((event: any) => {
      let isLiked = false;

      // add isLiked
      if (userId != null && event.likes && event.likes.length > 0) {
        // ObjectId 특성 상 IndexOf를 사용할 수 없어 loop로 비교(리팩토링 필요)
        for (const likeUserId of event.likes) {
          if (likeUserId.toString() == userId.toString()) {
            isLiked = true;
            break;
          }
        }
      }
      event.isLiked = isLiked;

      return event;
    });

    return result;
  }

  // Pagination을 위해 마지막 페이지를 구한다.
  async getEventLastPage(eventType: string | null, search: string | null, onOffLine: string | null) {
    const itemsPerPage = 4 * 5; // 한 페이지에 표현할 수
    let count = await this.eventsRepository.findMainLastPage(eventType, search, onOffLine);
    const lastPage = Math.ceil(count / itemsPerPage);
    return lastPage;
  }

  // 캘린더뷰 조회
  async getEventListInCalendar(
    year: number,
    month: number,
    eventType: string | null,
    search: string | null,
    userId: Types.ObjectId | null,
    onOffLine: string | null,
  ): Promise<EventMainListResponse[]> {
    let events: EventPOJO[] = await this.eventsRepository.findMainListInCalendar(
      year,
      month,
      eventType,
      search,
      onOffLine,
    );
    const result = this.addPostVirtualField(events, userId);
    return result;
  }

  // 진행중인 모든 공모전 조회(SelectBox 전용)
  async getEventTitleList(): Promise<EventTitleResponse[]> {
    let result: EventTitleResponse[] = await this.eventsRepository.findTitleListForSelectBox(80);
    return result;
  }

  // 조회수 증가
  async increaseView(eventId: Types.ObjectId) {
    await this.eventsRepository.increaseView(eventId); // 조회수 증가
  }

  //   // 공모전 등록
  async createEvent(event: EventCreateRequest) {
    // TODO 사용자 정보 기입
    //event.author = userID;
    let image = event.imageUrl;
    let smallImageUrl = image.replace('event-original', 'event-thumbnail'); // 이미지 등록 시 Lambda에서 thumbnail 이미지 생성
    const eventRecord = await this.eventsRepository.createEvent(event, smallImageUrl);
    return eventRecord;
  }

  // 공모전 수정
  async updateEvent(id: Types.ObjectId, event: EventCreateRequest) {
    // TODO 공모전 권한 관리
    // if (id.toString() !== tokenEventId.toString())
    //   throw new CustomError('NotAuthenticatedError', 401, 'Event does not match');
    const smallImageUrl = event.imageUrl.replace('event-original', 'event-thumbnail'); // 이미지 등록 시 Lambda에서 thumbnail 이미지 생성
    const eventRecord = await this.eventsRepository.updateEvent(id, event, smallImageUrl);
    return eventRecord;
  }

  // 공모전 삭제
  async deleteEvent(id: Types.ObjectId) {
    // TODO 공모전 권한 관리
    // if (id.toString() !== tokenEventId.toString())
    //   throw new CustomError('NotAuthenticatedError', 401, 'Event does not match');
    await this.eventsRepository.deleteEvent(id);
  }

  //   // 공모전 상세 조회
  async getEvent(eventId: Types.ObjectId, userId: Types.ObjectId): Promise<EventMainListResponse> {
    const event: EventPOJO = await this.eventsRepository.findByEventId(eventId);
    if (!event) {
      throw new NotFoundException(`not found event id`);
    }

    // 관심 등록 여부 추가
    let isLiked = false;
    // add isLiked
    if (userId != null && event.likes && event.likes.length > 0) {
      // ObjectId 특성 상 IndexOf를 사용할 수 없어 loop로 비교(리팩토링 필요)
      for (const likeUserId of event.likes) {
        if (likeUserId.toString() == userId.toString()) {
          isLiked = true;
          break;
        }
      }
    }
    const result: EventMainListResponse = { ...event, isLiked };
    await this.increaseView(eventId); // 조회수 증가
    return result;
  }
  // 글 상세에서 추천 이벤트 조회
  async getRecommendEventListInDetail(
    eventId: Types.ObjectId,
    eventType: string | null,
  ): Promise<EventRecommendedListResponse[]> {
    const size: number = 4;
    const notInEventId: Types.ObjectId[] = [eventId];
    let event = await this.eventsRepository.getRandomEventByType(notInEventId, eventType, size);
    if (event.length < 4) {
      event.forEach((i) => notInEventId.push(i._id));
      const moreEvent = await this.eventsRepository.getRandomEventByType(notInEventId, null, size - event.length);
      event.push(...moreEvent);
    }
    return event;
  }

  // 관심 등록 추가
  async addLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { event, isLikeExist } = await this.eventsRepository.addLike(postId, userId);
    if (!isLikeExist) {
      await this.likeEventsService.add(postId, userId);
    }
    return event;
  }

  //   // 관심 등록 취소(삭제)
  async deleteLike(postId: Types.ObjectId, userId: Types.ObjectId) {
    const { event, isLikeExist } = await this.eventsRepository.deleteLike(postId, userId);
    if (isLikeExist) {
      await this.likeEventsService.delete(postId, userId);
    }
    return event;
  }

  // S3 Pre-Sign Url을 발급한다.
  async getPreSignUrl(fileName: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `event-original/${fileName}`,
    } as GetObjectCommandInput);
    return getSignedUrl(this.s3Client, command, { expiresIn: 60 * 10 });
  }

  async updateClosedAfterEndDate() {
    await this.eventsRepository.updateClosedAfterEndDate();
  }

  //   // 추천 이벤트
  //   async findRecommendEventList() {
  //     // 광고 진행중인 공모전 조회
  //     const activeADInEvent = await this.adverisementModel.findActiveADListInEvent();

  //     // event 정보만 분리
  //     const adEventList = activeADInEvent
  //       .filter((i: any) => {
  //         return i.event && i.event.length > 0 && i.event[0] !== null && i.event[0] !== undefined;
  //       })
  //       .map((i: any) => {
  //         i.event[0].isAd = true;
  //         return i.event[0];
  //       });

  //     // 인기 공모전 조회 시 광고로 조회된 공모전 제외
  //     const notInEventId = adEventList.map((event: IEventDocument) => {
  //       return event._id;
  //     });

  //     // id를 분리하여 not in으로
  //     const events = await this.eventsRepository.findRecommendEventList(notInEventId);
  //     adEventList.push(...events);

  //     // 마감임박 뱃지 추가
  //     const today: Date = new Date();
  //     const result: any = adEventList.map((event: any) => {
  //       if (!event.isAd || event.isAd !== true) event.isAd = false;

  //       event.badge = [];
  //       if (event.applicationEndDate > today) {
  //         event.badge.push({
  //           type: 'deadline',
  //           name: `${timeForEndDate(event.applicationEndDate)}`,
  //         });
  //       }
  //       return event;
  //     });
  //     return result;
  //   }
}
