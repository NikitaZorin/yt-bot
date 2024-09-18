import { Ctx, Update, On, Start } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import {
  InlineQueryResultArticle,
  CallbackQuery,
} from 'telegraf/typings/core/types/typegram';

import { YoutubeService } from '../yt/yt.service';
import { SpotifyService } from '../spotify/spotify.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

const mainInlineKeyboard = [
  [{ text: 'Youtube 🍎', callback_data: 'yt' }],
  [{ text: 'Spotify 🍏', callback_data: 'spotify' }],
];

enum ServiceType {
  Spotify = 'spotify',
  Youtube = 'yt',
}

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
  constructor(
    private readonly config: ConfigService,
    private readonly youtube: YoutubeService,
    private readonly userService: UserService,
    private readonly spotify: SpotifyService,
  ) {
    super(config.get('TELEGRAM_TOKEN'));
  }

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    const resMsg = `By selecting one of them, the search will give you songs specifically for your service

What do you use?:
            `;

    await ctx.reply(resMsg, {
      reply_markup: {
        inline_keyboard: mainInlineKeyboard,
      },
    });
  }

  @On('callback_query')
  async changeService(@Ctx() ctx: Context) {
    const res = ctx.callbackQuery as CallbackQuery.DataQuery;
    if (res) {
      const type = res.data === ServiceType.Spotify ? 'spotify' : 'yt';

      await this.userService.createUpdateUser({
        chat_id: res.message.chat.id,
        type: type,
      });

      const resMsg = `You have chosen ${type === 'yt' ? 'Youtube 🍎' : 'Spotify 🍏'}, do you want to change your choice?`;

      await ctx.reply(resMsg, {
        reply_markup: {
          inline_keyboard: mainInlineKeyboard,
        },
      });
    }
  }

  @On('inline_query')
  async onMessage(@Ctx() ctx: Context) {
    const query = ctx.inlineQuery.query;

    const results = await this.getQueryResults(query, ctx.inlineQuery.from.id);
    await ctx.answerInlineQuery(results, {
      cache_time: 0,
      button: { text: 'Switch to YouTube/Spotify', start_parameter: 'test' },
    });
  }

  private async getQueryResults(
    query: string,
    chat_id: number,
  ): Promise<InlineQueryResultArticle[]> {
    const type = await this.linkCheck(query);

    if (type === 'Unknown') {
      const userType = await this.userService.getUser(chat_id);

      if (userType === 'spotify') {
        return await this.spotify.getSongUrl(query);
      } else {
        return await this.youtube.getSongUrl(query);
      }
    } else {
      return [];
    }
  }

  private async linkCheck(link: string): Promise<string> {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\/.+$/;
    const spotifyRegex = /^(https?:\/\/)?(open\.)?(spotify\.com)\/.+$/;

    if (youtubeRegex.test(link)) {
      return 'Youtube';
    } else if (spotifyRegex.test(link)) {
      return 'Spotify';
    } else {
      return 'Unknown';
    }
  }
}
