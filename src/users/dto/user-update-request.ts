import { PartialType, PickType } from '@nestjs/swagger';
import { User } from '../schema/user.schema';

export class UserUpdateRequest extends PartialType(
  PickType(User, [
    'nickName',
    'image',
    'position',
    'introduce',
    'workExperience',
    'organizationName',
    'organizationIsOpen',
    'likeLanguages',
    'urls',
  ] as const),
) {}
