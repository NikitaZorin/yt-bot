import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
// import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { options } from './telegram-config.factory';
import { YoutubeService } from 'src/yt/yt.service';




@Module({
    // imports: [
    //     ConfigModule.forRoot(),
    //     TelegrafModule.forRoot({
    //         token: process.env.TELEGRAM_TOKEN,
    //       })
    // ],
    imports: [
        TelegrafModule.forRootAsync(options())
    ],
    providers: [TelegramService, YoutubeService]
})
export class TelegramModule { }
