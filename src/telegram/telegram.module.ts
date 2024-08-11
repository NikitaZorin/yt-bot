import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';




@Module({
    imports: [
        ConfigModule.forRoot(),
        TelegrafModule.forRoot({
            token: process.env.TELEGRAM_TOKEN,
          })
    ],
    providers: [TelegramService]
})
export class TelegramModule { }
