import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: [{ type: String, required: true }] })
  participants: string[]; // 채팅방에 참여한 사용자들의 userId 문자열 배열 (필수 항목)

  @Prop({ type: [{ type: String }], default: [] })
  blockedUsers: string[]; // 채팅방에서 차단된 사용자들의 userId 문자열 배열

  @Prop({ type: Date, default: Date.now })
  lastMessageAt: Date; // 마지막 메시지가 전송된 시간
  
  @Prop({ type: String, default: '' })
  lastMessageText: string; // 마지막 메시지의 내용
  
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean; // 채팅방 삭제 여부
}

export const RoomSchema = SchemaFactory.createForClass(Room); //Mongoose Schema 객체로부터 생성
