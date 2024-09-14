import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ required: true })
  accessToken: string;

  @Prop({ required: true })
  expiresIn: number;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
