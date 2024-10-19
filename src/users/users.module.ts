import { SignOutUser, SignOutUserSchema } from './schema/signOutUser.schema';
import { JwtModule } from './../jwt/jwt.module';
import { UsersController } from './../users/users.controller';
import { User, UserSchema } from './../users/schema/user.schema';
import { UsersRepository } from './users.repository';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LikePostsModule } from '../like-posts/like-posts.module';
import { ReadPostsModule } from '../read-posts/read-posts.module';
import { PostsModule } from '../posts/posts.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { EventsModule } from 'src/events/events.module';
import { LikeEventsModule } from 'src/like-events/like-events.module';
import { AdvertisementsModule } from 'src/advertisement/advertisements.module';

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
    NotificationsModule,
    EventsModule,
    LikeEventsModule,
    AdvertisementsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
