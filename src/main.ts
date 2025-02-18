//main.ts => 서버 실행 및 초기 설정

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AuthIoAdapter } from './chat/adapters/auth.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // WebSocket 인증 어댑터 설정
  app.useWebSocketAdapter(new AuthIoAdapter(app));

  // Swagger API 문서 설정
  const options = new DocumentBuilder()
    .setTitle('Realtime Chat')
    .setDescription('Chat created using Nest.js + Websockets')
    .setVersion('1.0')
    .build();

  // Swagger 문서 생성 및 설정
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('PORT');
  await app.listen(port);
  console.log(`Server is running on port ${port}`);

}

bootstrap();
