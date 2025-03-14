import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

import { Room } from 'src/room/schema/room.schema';
import { Message } from 'src/room/schema/message.schema';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  avatar: string;

  @Prop({ default: false })
  is_admin: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  contacts: User[];
  
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  blockedUsers: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
