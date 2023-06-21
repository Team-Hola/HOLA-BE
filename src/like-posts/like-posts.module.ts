import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikePostsService } from './like-posts.service';
import { LikePost, LikePostSchema } from './schema/like-post.schema';
import { LikePostsRepository } from './like-posts.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: LikePost.name, schema: LikePostSchema }])],
  providers: [LikePostsService, LikePostsRepository],
  exports: [LikePostsService],
})
export class LikePostsModule {}
