import { JwtModule } from './../jwt/jwt.module';
import { UsersModule } from './../users/users.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginModule } from 'src/login/login.module';

@Module({
  imports: [UsersModule, LoginModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
