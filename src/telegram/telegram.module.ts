import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramService } from './telegram.service';
import { options } from './telegram-config.factory';

import { YoutubeService } from '../yt/yt.service';

import { SpotifyService } from '../spotify/spotify.service';
import { SpotifyModule } from '../spotify/spotify.module';

import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    TelegrafModule.forRootAsync(options()),
    SpotifyModule,
  ],
  providers: [TelegramService, YoutubeService, SpotifyService],
})
export class TelegramModule {}
