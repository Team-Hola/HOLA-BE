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
    return await this.userModel.findById(id).lean().exec();
  }

  async findSimpleUserById(id: Types.ObjectId): Promise<UserSimpleResponse> {
    return await this.userModel.findById(id).select(this.userDetailField).lean().exec();
  }
}
