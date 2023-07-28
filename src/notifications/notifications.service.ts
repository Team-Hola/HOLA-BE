import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { NotificationsRepository } from './notifications.repository';
import { timeForCreatedAt } from 'src/common/timeForCreatedAt';

type NotificationInfo = {
  icon: string;
  urn: string;
  title: string;
  buttonLabel: string;
};
@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  // 알림 리스트를 조회한다.
  async getNotificationList(userId: Types.ObjectId) {
    const notice = await this.notificationsRepository.findNotifications(userId);
    // 시간 전 계산
    const result = notice.map((item: any) => {
      item.timeAgo = timeForCreatedAt(item.createdAt);
      return item;
    });
    return result;
  }

  // 알림 정보 생성
  private getNotifictaionInfo(
    noticeType: string,
    nickName: string,
    postId?: Types.ObjectId,
    content?: string,
  ): NotificationInfo {
    let notifictaionInfo: NotificationInfo;
    if (noticeType === 'comment') {
      notifictaionInfo = {
        icon: `💬`,
        urn: `/study/${postId.toString()}`,
        title: `${nickName}이 댓글을 남겼어요: ${content}`,
        buttonLabel: `확인하기`,
      };
    } else if (noticeType === 'signup') {
      notifictaionInfo = {
        icon: `👋`,
        urn: `/setting`,
        title: `${nickName}님 반가워요 🥳 올라에서 원하는 팀원을 만나보세요 :)`,
        buttonLabel: `프로필 완성하기`,
      };
    }
    return notifictaionInfo;
  }

  // 알림 생성
  async createNotification(
    noticeType: string,
    targetUserId: Types.ObjectId,
    nickName: string,
    postId?: Types.ObjectId,
    createUserId?: Types.ObjectId,
    createObjectId?: Types.ObjectId,
    content?: string,
  ) {
    if (targetUserId.toString() === createUserId.toString()) return;
    const notifictaionInfo = this.getNotifictaionInfo(noticeType, nickName, postId, content); // 알림 정보 생성

    await this.notificationsRepository.createNotification(
      noticeType,
      targetUserId,
      notifictaionInfo.urn,
      notifictaionInfo.title,
      notifictaionInfo.icon,
      notifictaionInfo.buttonLabel,
      createUserId,
      createObjectId,
      postId,
    );
  }

  // 읽지 않은 알림 수를 조회한다.
  async findUnReadCount(author: Types.ObjectId) {
    const notice = await this.notificationsRepository.findUnReadCount(author);
    return notice;
  }

  // 알림 읽음 처리
  async readNotification(_id: Types.ObjectId) {
    await this.notificationsRepository.readNotification(_id);
  }

  // 알림 전체 읽음 처리
  async readAll(targetUserId: Types.ObjectId) {
    await this.notificationsRepository.readAll(targetUserId);
  }
}
