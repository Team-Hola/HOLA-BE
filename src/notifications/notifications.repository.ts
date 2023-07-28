import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationsRepository {
  constructor(@InjectModel(Notification.name) private postModel: Model<Notification>) {}

  async findNotifications(targetUserId: Types.ObjectId) {
    const today: Date = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));

    const result = await this.postModel
      .find({ targetUserId, createdAt: { $gte: oneMonthAgo } })
      .populate('createUserId', 'nickName')
      .sort('isRead -createdAt')
      .select(`title isRead href createUserId noticeType createdAt icon buttonLabel`)
      .lean();
    return result;
  }

  // 읽지 않은 알림 수 조회
  async findUnReadCount(targetUserId: Types.ObjectId): Promise<number> {
    const today: Date = new Date();
    const oneMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
    const unReadCount = await this.postModel.countDocuments({
      targetUserId,
      isRead: false,
      createdAt: { $gte: oneMonthAgo },
    });
    return unReadCount;
  }

  // 신규 알림 등록
  async createNotification(
    noticeType: string,
    targetUserId: Types.ObjectId,
    urn: string,
    title: string,
    icon: string,
    buttonLabel: string,
    createUserId?: Types.ObjectId,
    createObjectId?: Types.ObjectId,
    parentObjectId?: Types.ObjectId,
  ): Promise<void> {
    let domain: string = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://holaworld.io';
    let href = domain + urn;
    await this.postModel.create({
      targetUserId,
      createUserId,
      href,
      title,
      noticeType,
      createObjectId,
      buttonLabel,
      parentObjectId,
      icon,
    });
  }

  // 알림 수정
  async modifyNotificationTitle(createObjectId: Types.ObjectId, title): Promise<void> {
    await this.postModel.findOneAndUpdate({ createObjectId }, { title });
  }

  // 알림 삭제
  async deleteNotification(createObjectId: Types.ObjectId): Promise<void> {
    await this.postModel.deleteMany({ createObjectId });
  }

  // 글 삭제 시 관련 알림 제거
  async deleteNotificationByPost(postId: string): Promise<void> {
    await this.postModel.deleteMany({ parentObjectId: postId });
  }

  // 회원 탈퇴 시 관련 알림 제거
  async deleteNotificationByUser(userId: Types.ObjectId): Promise<void> {
    await this.postModel.deleteMany({ $or: [{ targetUserId: userId }, { createUserId: userId }] });
  }

  // 알림 읽음 처리
  async readNotification(_id: Types.ObjectId): Promise<void> {
    await this.postModel.updateMany(
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
  // 알림 전체 읽음 처리
  async readAll(targetUserId: Types.ObjectId): Promise<void> {
    await this.postModel.updateMany(
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
