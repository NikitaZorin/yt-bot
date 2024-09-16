import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { options } from './telegram-config.factory';

import { YoutubeService } from '../yt/yt.service';

import { SpotifyService } from '../spotify/spotify.service';
import { SpotifyModule } from '../spotify/spotify.module';

import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync(options()),
    SpotifyModule,
    UserModule
  ],
  providers: [TelegramService, YoutubeService, SpotifyService, UserService],
})
export class TelegramModule {}
