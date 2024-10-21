import { AuthService } from '../auth/auth.service';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { Body, HttpCode, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Get, Post, Controller } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginSuccessResponse } from './dto/login-success-response';
import { SocialLoginRequest } from './dto/social-login-request';
import { SignupRequiredResponse } from './dto/signup-required-response';
import { S3PreSignUrlRequestDto } from './dto/s3-pre-sign-url-request';
import {
  ApiExtraModels,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  refs,
} from '@nestjs/swagger';
import { AdminLoginRequest } from './dto/admin-login-request';

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(RefreshTokenGuard)
  @Get('token')
  @ApiOperation({ summary: 'Refresh Token을 이용해 Access Token 발급' })
  @ApiOkResponse({
    type: LoginSuccessResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getToken(@Req() request: Request): Promise<LoginSuccessResponse> {
    return this.authService.getUserByRefreshToken(request.cookies['R_AUTH']);
  }

  @Post('/login/admin')
  @ApiOperation({ summary: '어드민 로그인(id, password' })
  @ApiExtraModels(LoginSuccessResponse)
  @ApiOkResponse({
    description: '로그인 성공',
    schema: {
      anyOf: refs(LoginSuccessResponse),
    },
  })
  async adminLogin(
    @Body() dto: AdminLoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginSuccessResponse | SignupRequiredResponse> {
    const { id, password } = dto;
    const loginResult = await this.authService.adminLogin(id, password);
    if (loginResult.loginSuccess === true) {
      response.cookie('R_AUTH', loginResult.refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
      });
    }
    return loginResult;
  }

  @Post('login')
  @ApiOperation({ summary: '소셜 로그인(Google, Github, Kakao)' })
  @ApiExtraModels(LoginSuccessResponse, SignupRequiredResponse)
  @ApiOkResponse({
    description: '로그인 성공 or 회원가입 필요',
    schema: {
      anyOf: refs(LoginSuccessResponse, SignupRequiredResponse),
    },
  })
  async login(
    @Body() dto: SocialLoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginSuccessResponse | SignupRequiredResponse> {
    const { loginType, code } = dto;
    const loginResult = await this.authService.socialLogin(loginType, code);
    if (loginResult.loginSuccess === true) {
      response.cookie('R_AUTH', loginResult.refreshToken, {
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 14, // 2 Week
      });
    }
    return loginResult;
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiNoContentResponse()
  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('R_AUTH');
  }

  @ApiOperation({ summary: 'S3 Pre-Signed URL 발급' })
  @Get('s3/pre-sign-url')
  async getS3PreSignUrl(@Query() dto: S3PreSignUrlRequestDto) {
    const { fileName } = dto;
    return await this.authService.getS3PreSignedUrl(fileName);
  }
}
