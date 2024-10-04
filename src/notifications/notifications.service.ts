import { NotificationPOJO, NotificationsRepository } from './notifications.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FlattenMaps, Types } from 'mongoose';
import { NotificationRecentListResponse } from './dto/notification-recent-list-response';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  // 알림 리스트를 조회한다.
  async getRecentNotifications(userId: Types.ObjectId): Promise<NotificationRecentListResponse[]> {
    let notifications: NotificationPOJO[] = await this.notificationsRepository.findInLastMonth(userId);
    // 시간 전 계산
    const result = notifications.map((item: NotificationPOJO): NotificationRecentListResponse => {
      return {
        ...item,
        timeAgo: this.timeForCreatedAt(item.createdAt),
      };
    });
    return result;
  }

  // 읽지 않은 알림 수를 조회한다.
  async getUnreadNotificationCount(author: Types.ObjectId): Promise<number> {
    return await this.notificationsRepository.findUnreadNotifications(author);
  }

  // 알림 읽음 처리
  async readNotification(_id: Types.ObjectId): Promise<boolean> {
    await this.notificationsRepository.readNotification(_id);
    return true;
  }

  // 알림 전체 읽음 처리
  async readAllNotifications(targetUserId: Types.ObjectId): Promise<boolean> {
    await this.notificationsRepository.readAllNotifications(targetUserId);
    return true;
  }

  // 회원 가입 알림
  async createSignUpNotice(targetUserId: Types.ObjectId, nickName: string) {
    let icon = `👋`;
    let urn = `/setting`;
    let title = `${nickName}님 반가워요 🥳 올라에서 원하는 팀원을 만나보세요 :)`;
    let buttonLabel = `프로필 완성하기`;
    await this.notificationsRepository.createNotification('signup', targetUserId, urn, title, icon, buttonLabel);
  }

  // 댓글 알림
  async createCommentNotice(
    targetUserId: Types.ObjectId,
    nickName: string,
    postId: Types.ObjectId,
    createUserId: Types.ObjectId,
    createObjectId: Types.ObjectId,
    commentContent: string,
  ) {
    if (targetUserId.toString() === createUserId.toString()) return;

    let icon = `💬`;
    let urn = `/study/${postId.toString()}`;
    let title = `${nickName}이 댓글을 남겼어요: ${commentContent}`;
    let buttonLabel = `확인하기`;
    await this.notificationsRepository.createNotification(
      'comment',
      targetUserId,
      urn,
      title,
      icon,
      buttonLabel,
      createUserId,
      createObjectId,
      postId,
    );
  }

  async modifyCommentContent(commentId: Types.ObjectId, nickName: string, content: string) {
    let title = `${nickName}이 댓글을 남겼어요: ${content}`;
    await this.notificationsRepository.updateNotificationTitle(commentId, title);
  }

  // 댓글 삭제 시 관련 알림 삭제
  async deleteNotificationByCreateObjectId(createObjectId: Types.ObjectId): Promise<void> {
    await this.notificationsRepository.deleteNotificationByCreateObjectId(createObjectId);
  }

  // 글 삭제 시 관련 알림 제거
  async deleteNotificationByPostId(postId: Types.ObjectId): Promise<void> {
    await this.notificationsRepository.deleteNotificationByPostId(postId);
  }

  // 회원 탈퇴 시 관련 알림 제거
  async deleteNotificationByUser(userId: Types.ObjectId): Promise<void> {
    await this.notificationsRepository.deleteNotificationByUser(userId);
  }

  // ~시간전 계산
  timeForCreatedAt(createdAt: Date): string {
    const today: Date = new Date();
    if (createdAt > today) return ``;

    const betweenTime = Math.floor((today.getTime() - createdAt.getTime()) / 1000 / 60);
    if (betweenTime < 1) return '방금전';
    if (betweenTime < 60) {
      return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
  }
}
