import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';

// import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
// import { RoomModule } from 'src/room/room.module';

@Module({
  imports: [UserModule, AuthModule, RoomModule], //다른 모듈의 기능을 현재 모듈에서 사용하기 위해 가져오는 것
  providers: [ChatGateway], 
})
export class ChatModule {}


// providers의 역할
// NestJS에서 **의존성 주입(Dependency Injection)**을 위해 사용되는 서비스, 게이트웨이, 리포지토리, 헬퍼 클래스 등을 등록합니다.
// providers에 등록된 클래스는 NestJS가 인스턴스를 생성하고, 필요한 곳에 주입할 수 있게 합니다.
// 서비스 로직이나 게이트웨이, 커스텀 프로바이더는 주로 여기에 포함됩니다.