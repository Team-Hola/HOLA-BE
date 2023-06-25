import { SignOutUser, SignOutUserSchema } from './schema/signOutUser.schema';
import { JwtModule } from './../jwt/jwt.module';
import { UsersController } from './../users/users.controller';
import { User, UserSchema } from './../users/schema/user.schema';
import { UsersRepository } from './users.repository';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LikePostsModule } from 'src/like-posts/like-posts.module';
import { ReadPostsModule } from 'src/read-posts/read-posts.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: SignOutUser.name, schema: SignOutUserSchema },
    ]),
    JwtModule,
    LikePostsModule,
    ReadPostsModule,
    PostsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
