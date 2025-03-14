import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Room } from 'src/room/schema/room.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true }) //자동으로 createdAt과 updatedAt 필드가 생성
export class Message {
  @Prop({ required: true, maxlength: 500 })
  text: string; // 메시지 내용 (최대 500자)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Room', required: true })
  room: Room; // 이 메시지가 속한 채팅방의 ID

  @Prop({ type: String, required: true })
  sender: string; // 메시지 보낸 사용자의 ID

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean; // 메시지 삭제 상태 (기본값: 삭제되지 않음)

  @Prop({ default: false })
  isRead: boolean; // 메시지 읽음 상태 (기본값: 읽지 않음)

  @Prop({ type: String, enum: ['text', 'image'], default: 'text' })
  type: string;
  
  @Prop({ type: String, default: '' })
  imageurl: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

// 인덱스 추가
MessageSchema.index({ room: 1, createdAt: -1 });