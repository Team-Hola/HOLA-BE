import { AccessTokenPayload, JwtService } from 'src/jwt/jwt.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class GetAuthUserGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        const payload: AccessTokenPayload = await this.jwtService.verifyAccessToken(token);
        request['user'] = payload;
      } catch {}
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

// used
/*
@UseGuards(AuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}*/
