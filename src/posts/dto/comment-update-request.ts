import { PickType } from '@nestjs/swagger';
import { CommentCreateRequest } from './comment-create-request';

export class CommentUpdateRequest extends PickType(CommentCreateRequest, ['content'] as const) {}
