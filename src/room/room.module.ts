import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from 'src/user/user.module';

import { Room } from './schema/room.schema';
import { Message } from './schema/message.schema';

import { RoomController } from './room.controller';

import { RoomService } from './room.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Message]), UserModule],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
