import { JwtService } from './../jwt/jwt.service';
import { LoginSuccessResponse } from './../auth/dto/login-success-response';
import { AuthService } from 'src/auth/auth.service';
import { UserPOJO, UsersRepository } from './users.repository';
import { User } from './../users/schema/user.schema';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { SignupSuccessResponse } from './dto/signup-success-response';
import { UserUpdateRequest } from './dto/user-update-request';
import { LikePostsService } from 'src/like-posts/like-posts.service';
import { ReadPostsService } from 'src/read-posts/read-posts.service';
import { PostsService } from 'src/posts/posts.service';
import { UserSimpleResponse } from './dto/user-simple-response';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly likePostsService: LikePostsService,
    private readonly readPostsService: ReadPostsService,
    private readonly postsService: PostsService,
  ) {}

  async getUserSignUpResponse(user: UserPOJO): Promise<SignupSuccessResponse> {
    const { _id, idToken, nickName, image } = user;
    const accessToken = this.jwtService.createAccessToken({ _id, nickName, idToken });
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
    return await this.getUserSignUpResponse(user);
  }

  async deleteUser(id: Types.ObjectId) {
    const user = await this.getUserById(id);
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
}
