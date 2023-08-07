import { Module } from '@nestjs/common';
import { OauthLoginFactory } from './login.factory';
import { LoginService } from './login.service';

@Module({
  providers: [LoginService, OauthLoginFactory],
  exports: [LoginService],
})
export class LoginModule {}
