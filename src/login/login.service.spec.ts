import { Test, TestingModule } from '@nestjs/testing';
import { LoginFactory, OauthLoginFactory, OauthLoginPocliy } from './login.factory';
import { LoginService, OauthGetResponse } from './login.service';

describe('LoginService', () => {
  const loginSuccessResponse = {
    idToken: '48292199',
    name: 'hola',
    email: 'team.hola.official@gmail.com',
  };

  class MockLoginPolicy implements OauthLoginPocliy {
    async login(token: string): Promise<OauthGetResponse> {
      return loginSuccessResponse;
    }
  }
  class MockLoginFactory implements LoginFactory {
    getLoginPolicy(loginType: string): OauthLoginPocliy {
      return new MockLoginPolicy();
    }
  }

  let service: LoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService, { provide: OauthLoginFactory, useClass: MockLoginFactory }],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  describe('Oauth 2.0 Social Login', () => {
    it('Login Success', async () => {
      expect(service).toBeDefined();
      const loginResponse = await service.loginOauth('google', loginSuccessResponse.idToken);
      expect(loginResponse).toBe(loginSuccessResponse);
    });
  });
});
