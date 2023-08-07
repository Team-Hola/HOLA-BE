import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';
import { OauthGetResponse } from './login.service';

export interface OauthLoginPocliy {
  login(token: string): Promise<OauthGetResponse>;
}

export class GoogleLoginPolicy implements OauthLoginPocliy {
  async login(token: string): Promise<OauthGetResponse> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    if (!ticket) throw new BadRequestException('Login ticket not found');
    const payload = ticket.getPayload();
    if (!payload) throw new BadRequestException('Oauth user payload not found');

    return {
      idToken: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}

export class GithubLoginPolicy implements OauthLoginPocliy {
  async login(token: string): Promise<OauthGetResponse> {
    // 인가코드를 이용하여 AccessToken 발급
    const accessToken = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        code: token,
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      },
      {
        headers: {
          accept: 'application/json',
        },
      },
    );

    if (!accessToken || !accessToken.data || !accessToken.data.access_token)
      throw new BadRequestException('User access token not found');

    // 사용자 정보 가져오기
    const { data: userInfo } = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${accessToken.data.access_token}`,
      },
    });
    if (!userInfo) throw new BadRequestException('Oauth user payload not found');
    return {
      idToken: userInfo.id,
      name: userInfo.id,
    };
  }
}

export class KakaoLoginPolicy implements OauthLoginPocliy {
  async login(token: string): Promise<OauthGetResponse> {
    // 사용자 정보 가져오기
    const kakaoResponse = await axios.post(
      'https://kapi.kakao.com/v2/user/me',
      {
        property_keys: ['kakao_account.email'],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!kakaoResponse) throw new BadRequestException('Oauth user payload not found');
    return {
      idToken: kakaoResponse.data.id,
      name: kakaoResponse.data.kakao_account.profile.nickname,
    };
  }
}

export interface LoginFactory {
  getLoginPolicy(loginType: string): OauthLoginPocliy;
}

@Injectable()
export class OauthLoginFactory implements LoginFactory {
  constructor() {}
  getLoginPolicy(loginType: string): OauthLoginPocliy {
    if (loginType === 'google') return new GoogleLoginPolicy();
    else if (loginType === 'github') return new GithubLoginPolicy();
    else if (loginType === 'kakao') return new KakaoLoginPolicy();
    else throw new BadRequestException('Invalid Login Type');
  }
}
