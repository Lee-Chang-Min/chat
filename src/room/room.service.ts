import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserService } from 'src/user/user.service';

import { Room, RoomDocument } from './schema/room.schema';
import { Message, MessageDocument } from './schema/message.schema';

import { AddMessageDto } from 'src/chat/dto/add-message.dto';
import { CreateRoomDto } from 'src/room/dto/create-room.dto';
import { UpdateRoomDto } from 'src/room/dto/update-room.dto';
import { BanUserDto } from 'src/chat/dto/ban-user.dto';

@Injectable()
export class RoomService {
  /* 
   @InjectModel(Room.name):
   @InjectModel을 사용하여 Mongoose 모델을 주입받습니다.
   Room.name은 Room 모델의 이름입니다. Mongoose는 자동으로 모델 이름을 기반으로 컬렉션을 찾습니다. 
   따라서, Room 모델에 대해 Room.name을 사용하여 주입합니다.
  */
 
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>,
  ) {}



  // 모든 채팅방 목록을 조회합니다 (삭제되지 않은 채팅방만)
  async findAll(): Promise<Room[]> {
    return this.roomModel.find({ isDeleted: false }).sort({ lastMessageAt: -1 }).exec();
  }


  async findOne(id: string) {
    const room = await this.roomModel.findById(id).exec();

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return room;
  }

  async findOneWithRelations(id: string) {
    const room = await this.roomRepository.findOne(id, {
      relations: ['messages', 'users', 'bannedUsers'],
    });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return room;
  }

  async findOneByName(name: string) {
    const room = await this.roomRepository.findOne({ name });

    return room;
  }

  async create(createRoomDto: CreateRoomDto) {
    const room = await this.roomRepository.create({
      ...createRoomDto,
    });

    return this.roomRepository.save(room);
  }

  async addMessage(addMessageDto: AddMessageDto) {
    const { roomId, userId, text } = addMessageDto;

    const room = await this.findOne(roomId);
    const user = await this.userService.findOne(userId);

    const message = await this.messageRepository.create({
      text,
      room,
      user,
    });

    return this.messageRepository.save(message);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.preload({
      id,
      ...updateRoomDto,
    });

    if (!room) {
      throw new NotFoundException(`There is no room under id ${id}`);
    }

    return this.roomRepository.save(room);
  }

  async banUserFromRoom(banUserDto: BanUserDto) {
    const { userId, roomId } = banUserDto;

    const user = await this.userService.findOne(userId);
    const room = await this.findOne(roomId);

    await this.userService.updateUserRoom(userId, null);

    const bannedUsers = { ...room.bannedUsers, ...user };
    const updatedRoom = await this.roomRepository.preload({
      id: roomId,
      bannedUsers,
    });

    return this.roomRepository.save(updatedRoom);
  }

  async remove(id: string) {
    const room = await this.findOne(id);

    return this.roomRepository.remove(room);
  }
}
