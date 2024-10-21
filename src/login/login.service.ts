import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { OauthLoginFactory, OauthLoginPocliy } from './login.factory';

export type OauthGetResponse = {
  idToken: string;
  name: string;
  email?: string;
};

@Injectable()
export class LoginService {
  constructor(private loginFactory: OauthLoginFactory) {}
  async loginOauth(loginType: string, token: string): Promise<OauthGetResponse> {
    const loginPolicy: OauthLoginPocliy = this.loginFactory.getLoginPolicy(loginType);
    let oAuthResponse: OauthGetResponse;
    try {
      oAuthResponse = await loginPolicy.login(token);
    } catch (error) {
      throw new BadRequestException(`Invalid oauth parameter`);
    }
    return oAuthResponse;
  }

  // 어드민 로그인
  adminLogin(id: string, password: string): string {
    if (id === process.env.ADMIN_ID && password === process.env.ADMIN_PASSWORD) {
      return 'admin'; // idToken
    } else {
      throw new UnauthorizedException('Id/Password is Invalid');
    }
  }
}
