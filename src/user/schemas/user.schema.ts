import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;


export interface UserData {
  chat_id: number;
  type: 'yt' | 'spotify';
}

@Schema()
export class User {
  @Prop({ required: true })
  chatId: number;

  @Prop({ required: true })
  type: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
