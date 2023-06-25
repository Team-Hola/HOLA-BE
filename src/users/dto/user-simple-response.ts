import { PickType } from '@nestjs/swagger';
import { User } from '../schema/user.schema';

export class UserSimpleResponse extends PickType(User, [
  '_id',
  'nickName',
  'image',
  'position',
  'introduce',
  'workExperience',
  'organizationName',
  'organizationIsOpen',
  'likeLanguages',
  'urls',
  'createdAt',
  'updatedAt',
] as const) {}
