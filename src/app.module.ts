// app.module.ts => 라우터, 서비스, 데이터베이스 설정 등을 정의
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// import { ChatModule } from './chat/chat.module';
// import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// import { RoomModule } from './room/room.module';

import { validate } from './utils/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.env.NODE_ENV}` === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true, //전역 모듈로 설정
      validate, // 환경 변수 유효성 검사
    }), // 환경 변수 로드
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: 'dev',
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }),
    // ChatModule,
    // UserModule, 
    AuthModule,
    // RoomModule,
  ],
  providers: [],
})
export class AppModule {}
