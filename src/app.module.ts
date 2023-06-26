import { ReadPostsModule } from './read-posts/read-posts.module';
import { LoginModule } from 'src/login/login.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { CheckNicknameDuplicationMiddleware } from './users/middleware/check-nickname-duplication.middleware';
import { JwtModule } from './jwt/jwt.module';
import { CommonModule } from './common/common.module';
import { LikePostsModule } from './like-posts/like-posts.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],
      isGlobal: true,
    }),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
    PostsModule,
    LoginModule,
    JwtModule,
    CommonModule,
    LikePostsModule,
    ReadPostsModule,
  ],
  controllers: [AppController],
  providers: [ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(CheckNicknameDuplicationMiddleware)
      .forRoutes(
        { path: 'api/users/signup', method: RequestMethod.POST },
        { path: 'api/users/:id', method: RequestMethod.PATCH },
      );
  }
}
