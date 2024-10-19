import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { NotificationType } from 'src/CommonCode';

export type NotificationPOJO = FlattenMaps<Notification>;

@Injectable()
export class NotificationsRepository {
  constructor(@InjectModel(Notification.name) private notificationModel: Model<Notification>) {}

  // 최근 알림 조회
  async findInLastMonth(targetUserId: Types.ObjectId): Promise<NotificationPOJO[]> {
    const today: Date = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1)); // 1달 이내 글만 조회

    return await this.notificationModel
      .find({ targetUserId, createdAt: { $gte: oneMonthAgo } })
      .populate('createUserId', 'nickName')
      .sort('isRead -createdAt')
      .select(`title isRead href createUserId noticeType createdAt icon buttonLabel content`)
      .lean();
  }

  async findUnreadNotifications(targetUserId: Types.ObjectId): Promise<number> {
    const today: Date = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));

    return await this.notificationModel.countDocuments({
      targetUserId,
      isRead: false,
      createdAt: { $gte: oneMonthAgo },
    });
  }

  async createNotification(
    noticeType: NotificationType,
    targetUserId: Types.ObjectId,
    urn: string,
    title: string,
    content: string,
    icon: string,
    buttonLabel: string,
    createUserId?: Types.ObjectId,
    createObjectId?: Types.ObjectId,
    parentObjectId?: Types.ObjectId,
  ) {
    let domain: string = process.env.APP_URL;
    let href = domain + urn;
    return this.notificationModel.create({
      targetUserId,
      createUserId,
      href,
      title,
      content,
      noticeType,
      createObjectId,
      buttonLabel,
      parentObjectId,
      icon,
    });
  }

  async updateNotificationTitle(createObjectId: Types.ObjectId, title: string): Promise<void> {
    await this.notificationModel.findOneAndUpdate({ createObjectId }, { title: title });
  }

  // 댓글 삭제 시 관련 알림 삭제
  async deleteNotificationByCreateObjectId(createObjectId: Types.ObjectId): Promise<void> {
    await this.notificationModel.deleteMany({ createObjectId });
  }

  // 글 삭제 시 관련 알림 제거
  async deleteNotificationByPostId(postId: Types.ObjectId): Promise<void> {
    await this.notificationModel.deleteMany({ parentObjectId: postId });
  }

  // 회원 탈퇴 시 관련 알림 제거
  async deleteNotificationByUser(userId: Types.ObjectId): Promise<void> {
    await this.notificationModel.deleteMany({ $or: [{ targetUserId: userId }, { createUserId: userId }] });
  }

  // 회원 탈퇴 시 관련 알림 제거
  async readNotification(_id: Types.ObjectId): Promise<void> {
    await this.notificationModel.updateMany(
      {
        _id,
        isRead: false,
      },
      {
        readDate: new Date(),
        isRead: true,
      },
    );
  }

  // 회원 탈퇴 시 관련 알림 제거
  async readAllNotifications(targetUserId: Types.ObjectId): Promise<void> {
    await this.notificationModel.updateMany(
      {
        targetUserId,
        isRead: false,
      },
      {
        readDate: new Date(),
        isRead: true,
      },
    );
  }
}
