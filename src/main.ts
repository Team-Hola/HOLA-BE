import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV === 'production' ? ['error', 'warn', 'log'] : ['error', 'warn', 'log', 'verbose', 'debug'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   transform: true,
  // }),

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Hola! API Docs')
      .setDescription('API description')
      .setVersion('1.0')
      .addTag('users')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
