import { SignOutUser } from './schema/signOutUser.schema';
import { User } from './../users/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FlattenMaps, Model, Types } from 'mongoose';
import { UserUpdateRequest } from './dto/user-update-request';
import { UserSimpleResponse } from './dto/user-simple-response';

export type UserPOJO = FlattenMaps<User>;

@Injectable()
export class UsersRepository {
  private userDetailField =
    '_id nickName image position introduce workExperience organizationName organizationIsOpen likeLanguages urls createdAt updatedAt';
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(SignOutUser.name) private signOutUserModel: Model<SignOutUser>,
  ) {}
  async create(idToken: string, tokenType: string, name: string, email: string | null): Promise<UserPOJO> {
    const user = await this.userModel.create({
      idToken,
      tokenType,
      name,
      email,
    });
    return user.toObject();
  }

  async createSignOutUser(
    idToken: string,
    tokenType: string,
    nickName: string,
    signInDate: Date,
    userId: Types.ObjectId,
  ): Promise<void> {
    await this.signOutUserModel.create({
      idToken,
      tokenType,
      nickName,
      signInDate,
      signOutDate: new Date(),
      userId,
    });
  }

  async signUp(id: Types.ObjectId, nickName: string, position: string, workExperience: string): Promise<UserPOJO> {
    return this.userModel
      .findByIdAndUpdate(id, {
        nickName,
        position,
        workExperience,
      })
      .lean();
  }

  async findByIdAndUpdate(id: Types.ObjectId, user: UserUpdateRequest): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, user, { new: true });
    return updatedUser;
  }

  async findByIdAndDelete(id: Types.ObjectId) {
    await this.userModel.findByIdAndDelete(id);
  }

  async findUserByNickname(nickName: string): Promise<UserPOJO> {
    return await this.userModel.findOne({ nickName }).lean().exec();
  }
  async findSimpleUserByNickname(nickName: string): Promise<UserSimpleResponse> {
    return await this.userModel.findOne({ nickName }).select(this.userDetailField).lean().exec();
  }

  async findUserByIdToken(idToken: string): Promise<UserPOJO> {
    return await this.userModel.findOne({ idToken }).lean().exec();
  }

  async findUserById(id: Types.ObjectId): Promise<UserPOJO> {
    return await this.userModel
      .findById(id)
      .select(
        '_id nickName image workExperience position organizationName organizationIsOpen urls introduce likeLanguages status',
      )
      .lean()
      .exec();
  }

  async findSimpleUserById(id: Types.ObjectId): Promise<UserSimpleResponse> {
    return await this.userModel.findById(id).select(this.userDetailField).lean().exec();
  }

  // 사용자 수 집계
  async countUsers(today: Date | null) {
    if (today) {
      return this.userModel.countDocuments({ createdAt: { $gte: today } });
    } else {
      return this.userModel.countDocuments();
    }
  }

  // 탈퇴 사용자 수 집계
  async countSignOutUsers(today: Date | null) {
    return this.signOutUserModel.countDocuments({ signOutDate: { $gte: today } });
  }

  async aggregateDailySignups(start: Date, end: Date) {
    return await this.userModel.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, signIn: { $sum: 1 } } },
      { $addFields: { signOut: 0 } },
      {
        $unionWith: {
          coll: 'signoutusers',
          pipeline: [
            { $match: { signOutDate: { $gte: start, $lte: end } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$signOutDate' } }, signOut: { $sum: 1 } } },
            { $addFields: { signIn: 0 } },
          ],
        },
      },
      { $group: { _id: '$_id', signIn: { $sum: '$signIn' }, signOut: { $sum: '$signOut' } } },
      { $sort: { _id: 1 } },
    ]);
  }

  // 사용자가 선택하는 필드 집계
  async aggreagteSelectionFields(field: 'position' | 'workExperience' | 'likeLanguages' | 'status') {
    return await this.userModel.aggregate([
      {
        $unwind: `$${field}`, // 배열을 펼침
      },
      {
        $group: {
          _id: `$${field}`,
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          [field]: '$_id',
          count: 1,
        },
      },
      {
        $sort: {
          count: -1, // count로 내림차순 정렬
        },
      },
    ]);
  }
}
