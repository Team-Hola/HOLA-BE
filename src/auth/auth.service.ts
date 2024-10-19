import { UserPOJO } from './../users/users.repository';
import { JwtService } from './../jwt/jwt.service';
import { UsersService } from './../users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginSuccessResponse } from './dto/login-success-response';
import { LoginService, OauthGetResponse } from '../login/login.service';
import { SignupRequiredResponse } from './dto/signup-required-response';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AuthService {
  private s3Config;
  private s3Client;
  constructor(private userService: UsersService, private loginService: LoginService, private jwtService: JwtService) {
    this.s3Config = {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
      region: process.env.S3_BUCKET_REGION,
    };
    this.s3Client = new S3Client(this.s3Config);
  }

  async socialLogin(loginType: string, code: string): Promise<LoginSuccessResponse | SignupRequiredResponse> {
    const oauthResult: OauthGetResponse = await this.loginService.loginOauth(loginType, code);
    const { idToken, name, email } = oauthResult;
    const { isSignedUp, user } = await this.isSignedUpUser(idToken);
    if (isSignedUp === false) {
      let signUpUser = user;
      if (!signUpUser) signUpUser = await this.userService.create(idToken, loginType, name, email);

      return {
        _id: signUpUser._id,
        loginSuccess: false,
        SignupRequiredResponse: true,
        message: '회원 가입을 진행해야 합니다.',
      };
    } else {
      return await this.getLoginSuccessResponse(user);
    }
  }

  async getUserByRefreshToken(refreshToken: string): Promise<LoginSuccessResponse> {
    const { nickName } = this.jwtService.verifyRefreshToken(refreshToken);
    const user: UserPOJO = await this.userService.getUserByNickname(nickName);
    if (!user) throw new UnauthorizedException();
    return await this.getLoginSuccessResponse(user);
  }

  async getS3PreSignedUrl(fileName: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
    });
    return await getSignedUrl(this.s3Client, command, { expiresIn: 60 * 60 * 3 });
  }

  async getLoginSuccessResponse(user: UserPOJO): Promise<LoginSuccessResponse> {
    const { _id, idToken, tokenType, nickName, image, likeLanguages } = user;
    const accessToken = this.jwtService.createAccessToken({ _id, nickName, idToken, tokenType });
    const refreshToken = this.jwtService.createRefreshToken({ nickName });
    return {
      loginSuccess: true,
      _id,
      nickName,
      image,
      likeLanguages,
      accessToken,
      refreshToken,
    };
  }

  // 회원 가입된 유저인지체크
  private async isSignedUpUser(idToken: string) {
    const user: UserPOJO = await this.userService.getUserByIdToken(idToken);
    return {
      isSignedUp: user && user.nickName ? true : false,
      user,
    };
  }
}
