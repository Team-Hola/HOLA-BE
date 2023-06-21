import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReadPostsService } from './read-posts.service';
import { ReadPost, ReadPostSchema } from './schema/read-post.schema';
import { ReadPostsRepository } from './read-posts.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: ReadPost.name, schema: ReadPostSchema }])],
  providers: [ReadPostsService, ReadPostsRepository],
  exports: [ReadPostsService],
})
export class ReadPostsModule {}
