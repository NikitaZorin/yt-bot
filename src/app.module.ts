import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './telegram/telegram.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // MongooseModule.forRoot(process.env.DB_URI),
    TelegramModule,
    // Telegram module
  ]
})
export class AppModule {}
