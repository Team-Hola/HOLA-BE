import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoginService } from '../src/login/login.service';
import mockdata from './mockData';
import { Console } from 'console';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userId;
  let accessToken;
  beforeAll(async () => {
    const MockLoginService = {
      loginOauth: () => ({
        idToken: mockdata.OauthLoginResponse.idToken,
        name: mockdata.OauthLoginResponse.name,
        email: mockdata.OauthLoginResponse.email,
      }),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LoginService)
      .useValue(MockLoginService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    await app.init();
  });

  describe('최초 로그인', () => {
    it('가입되지 않은 사용자는 회원 가입 필요', async () => {
      const response = await request(app.getHttpServer()).post('/api/auth/login').send({
        loginType: mockdata.OauthLoginResponse.loginType,
        code: mockdata.OauthLoginResponse.idToken,
      });
      expect(response.status).toEqual(201);
      expect(response.body).toBeDefined();
      expect(response.body._id).toBeDefined();
      expect(response.body.loginSuccess).toEqual(false);
      userId = response.body._id;
    });
  });

  describe('회원 가입', () => {
    it('회원가입 성공', async () => {
      const response = await request(app.getHttpServer()).post('/api/users/signup').send({
        id: userId,
        nickName: mockdata.signUp.nickName,
        position: mockdata.signUp.position,
        workExperience: mockdata.signUp.workExperience,
      });

      expect(response.status).toEqual(201);
      expect(response.body).toBeDefined();
      expect(response.body._id).toBeDefined();
      expect(response.body.accessToken).toBeDefined();
      accessToken = response.body.accessToken;
    });
  });

  describe('회원 탈퇴', () => {
    it('DELETE /api/user/:id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.status).toEqual(204);
      expect(response.body).toBeDefined();
    });
  });
});
