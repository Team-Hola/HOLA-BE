import { Types } from 'mongoose';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId: boolean = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }

    return new Types.ObjectId(value);
  }
}
