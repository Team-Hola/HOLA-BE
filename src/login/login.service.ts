import { BadRequestException, Injectable } from '@nestjs/common';
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
}
