import { Types } from 'mongoose';
import { PostPOJO } from '../posts.repository';

export class CommentCreateSuccessResponse {
  commentId: Types.ObjectId;

  post: PostPOJO;
}
