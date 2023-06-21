import { AccessTokenPayload, JwtService } from 'src/jwt/jwt.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

// - Access token 유효성 체크
// - query parameter의 id, token의 id가 일치하는지 체크
@Injectable()
export class UserAuthorizationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: AccessTokenPayload = await this.jwtService.verifyAccessToken(token);
      const params = request.params;
      if (payload._id != params.id) throw new UnauthorizedException();
      request['user'] = payload;
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
