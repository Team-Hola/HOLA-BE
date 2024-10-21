import { JwtService } from './../jwt/jwt.service';
import { UserPOJO, UsersRepository } from './users.repository';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { SignupSuccessResponse } from './dto/signup-success-response';
import { UserUpdateRequest } from './dto/user-update-request';
import { LikePostsService } from '../like-posts/like-posts.service';
import { ReadPostsService } from '../read-posts/read-posts.service';
import { PostsService } from '../posts/posts.service';
import { UserSimpleResponse } from './dto/user-simple-response';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly likePostsService: LikePostsService,
    private readonly readPostsService: ReadPostsService,
    private readonly postsService: PostsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getUserSignUpResponse(user: UserPOJO): Promise<SignupSuccessResponse> {
    const { _id, idToken, tokenType, nickName, image } = user;
    const accessToken = this.jwtService.createAccessToken({ _id, nickName, idToken, tokenType });
    const refreshToken = this.jwtService.createRefreshToken({ nickName });
    return {
      _id,
      nickName,
      image,
      accessToken,
      refreshToken,
      isExists: false,
    };
  }

  async create(idToken: string, tokenType: string, name: string, email: string | null): Promise<UserPOJO> {
    return await this.usersRepository.create(idToken, tokenType, name, email);
  }

  async update(id: Types.ObjectId, user: UserUpdateRequest): Promise<SignupSuccessResponse> {
    const updatedUser = await this.usersRepository.findByIdAndUpdate(id, user);
    return this.getUserSignUpResponse(updatedUser);
  }

  async signUp(
    id: Types.ObjectId,
    nickName: string,
    position: string,
    workExperience: string,
  ): Promise<SignupSuccessResponse> {
    const user = await this.usersRepository.signUp(id, nickName, position, workExperience);
    if (!user) throw new BadRequestException('User not found');
    this.notificationsService.createSignUpNotice(id, nickName); // 회원 가입 알림 발송
    return await this.getUserSignUpResponse(user);
  }

  async deleteUser(id: Types.ObjectId) {
    const user = await this.getUserById(id);
    if (!user) throw new BadRequestException('User not found');

    await this.postsService.deletePostBySignOutUser(id); // 사용자가 작성한 글 제거
    await this.postsService.deleteCommentBySignOutUser(id); // 사용자가 작성한 댓글 제거
    const { idToken, tokenType, nickName, createdAt, _id } = user;
    await this.usersRepository.createSignOutUser(idToken, tokenType, nickName, createdAt, _id); // 탈퇴 이력 생성
    await this.usersRepository.findByIdAndDelete(id);
  }

  async checkNicknameDuplication(nickName: string): Promise<boolean> {
    const user = await this.getUserByNickname(nickName);
    return user ? true : false;
  }

  async getUserByNickname(nickName: string): Promise<UserPOJO> {
    return await this.usersRepository.findUserByNickname(nickName);
  }
  async getSimpleUserByNickname(nickName: string): Promise<UserSimpleResponse> {
    const user = await this.usersRepository.findSimpleUserByNickname(nickName);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async getUserByIdToken(idToken: string): Promise<UserPOJO> {
    return await this.usersRepository.findUserByIdToken(idToken);
  }
  async getUserById(id: Types.ObjectId): Promise<UserPOJO> {
    const user = await this.usersRepository.findUserById(id);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }

  async getSimpleUserById(id: Types.ObjectId): Promise<UserSimpleResponse> {
    const user = await this.usersRepository.findSimpleUserById(id);
    if (!user) throw new NotFoundException(`User not found`);
    return user;
  }
  async getLikedPostByUser(userId: Types.ObjectId, offset: number, limit: number) {
    return await this.likePostsService.getLikedPostByUserId(userId, offset, limit);
  }

  async getReadPostByUser(userId: Types.ObjectId, offset: number, limit: number) {
    return await this.readPostsService.getReadPostByUser(userId, offset, limit);
  }

  async getWrittenPostByUser(userId: Types.ObjectId, offset: number, limit: number) {
    return await this.postsService.getWrittenPostByUser(userId, offset, limit);
  }

  // 사용자 수 집계
  async countUsers(today: Date | null) {
    return await this.usersRepository.countUsers(today);
  }

  // 탈퇴 사용자 수 집계
  async countSignOutUsers(today: Date | null) {
    return await this.usersRepository.countSignOutUsers(today);
  }
  // 일자별 회원 가입 현황(일자 / 신규 가입자 / 탈퇴자)
  async aggregateDailySignups(start: Date, end: Date) {
    return await this.usersRepository.aggregateDailySignups(start, end);
  }

  // 사용자가 선택하는 필드 집계
  async aggreagteSelectionFields(field: 'position' | 'workExperience' | 'likeLanguages' | 'status') {
    return await this.usersRepository.aggreagteSelectionFields(field);
  }
}
