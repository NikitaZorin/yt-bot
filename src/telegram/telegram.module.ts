import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
// import { ConfigModule } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { options } from './telegram-config.factory';
import { YoutubeService } from 'src/yt/yt.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { SpotifyModule } from 'src/spotify/spotify.module';




@Module({
    imports: [
        TelegrafModule.forRootAsync(options()),
        SpotifyModule
    ],
    providers: [TelegramService, YoutubeService, SpotifyService]
})
export class TelegramModule { }
