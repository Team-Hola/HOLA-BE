import { LikePostsModule } from './../like-posts/like-posts.module';
import { ReadPostsModule } from './../read-posts/read-posts.module';
import { JwtModule } from './../jwt/jwt.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    JwtModule,
    ReadPostsModule,
    LikePostsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}
