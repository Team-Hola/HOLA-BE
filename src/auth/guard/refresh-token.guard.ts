import { JwtService } from 'src/jwt/jwt.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  private validateRequest(request: Request) {
    const refreshToken = request.cookies['R_AUTH'];
    this.jwtService.verifyRefreshToken(refreshToken);
    return true;
  }
}
