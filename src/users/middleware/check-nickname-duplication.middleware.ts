import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';

@Injectable()
export class CheckNicknameDuplicationMiddleware implements NestMiddleware {
  constructor(private userService: UsersService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.nickName) {
      if ((await this.userService.checkNicknameDuplication(req.body.nickName)) === true)
        return res.status(200).json({
          message: `Nickname is duplicated.`,
          isExists: true,
        });
    }
    next();
  }
}
