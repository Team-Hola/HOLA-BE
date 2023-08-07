import { Test, TestingModule } from '@nestjs/testing';
import { LoginService, OauthGetResponse } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let googleLogin: OauthLogin;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: 'GoogleLogin',
          useClass: GoogleLogin,
        },
        {
          provide: 'GithubLogin',
          useClass: GithubLogin,
        },
        {
          provide: 'KakaoLogin',
          useClass: KakaoLogin,
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    googleLogin = module.get<GoogleLogin>(GoogleLogin);
  });

  describe('Oauth 2.0 Social Login', () => {
    it('Google Login Success', async () => {
      const result: OauthGetResponse = {
        idToken: '12345',
        name: 'tmkim',
        email: 'team.hola.official@gmail.com',
      };
      jest.spyOn(googleLogin, 'login').mockImplementation(async (token: string) => result);
      expect(service).toBeDefined();
      const loginResponse = await service.loginOauth('google', '12345');
      console.log(loginResponse);
      expect(loginResponse.idToken).toBe(result);
    });
  });
});
