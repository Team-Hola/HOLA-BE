import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export type RefreshTokenPayload = {
  nickName: string;
};

export type AccessTokenPayload = {
  _id: Types.ObjectId;
  nickName: string;
  idToken: string;
  tokenType: string;
};

@Injectable()
export class JwtService {
  createAccessToken(tokenPayload: AccessTokenPayload): string {
    const payload = { ...tokenPayload };
    return jwt.sign(payload, process.env.AUTH_JWT_KEY, {
      expiresIn: '1h',
      audience: process.env.AUTH_ISSUER,
      issuer: process.env.AUTH_ISSUER,
    });
  }

  createRefreshToken(tokenPayload: RefreshTokenPayload): string {
    const payload = { ...tokenPayload };
    return jwt.sign(payload, process.env.AUTH_JWT_KEY, {
      expiresIn: '2w',
      audience: process.env.AUTH_ISSUER,
      issuer: process.env.AUTH_ISSUER,
    });
  }

  verifyAccessToken(jwtString: string): AccessTokenPayload {
    try {
      const payload = jwt.verify(jwtString, process.env.AUTH_JWT_KEY) as (jwt.JwtPayload | string) & AccessTokenPayload;
      const { _id, nickName, idToken, tokenType } = payload;
      return {
        _id,
        nickName,
        idToken,
        tokenType,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  verifyRefreshToken(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, process.env.AUTH_JWT_KEY) as (jwt.JwtPayload | string) &
        RefreshTokenPayload;
      const { nickName } = payload;
      return {
        nickName,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
