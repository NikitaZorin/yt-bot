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

import { LinkType, ServiceType } from './telegram.enums';

const mainInlineKeyboard = [
  [{ text: 'Youtube 🍎', callback_data: 'yt' }],
  [{ text: 'Spotify 🍏', callback_data: 'spotify' }],
];

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

  @On('inline_query') // добавить сюда логику получения по ссылке, использовать название трека 
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
    const { type, id } = await this.linkCheck(query);

    if (query) {
      if (id) {
        query = await this[type].getSongTitle(id);
      }

      const userType = await this.userService.getUser(chat_id);

      if (userType === 'spotify' || (type === "youtube" && id)) {
        return await this.spotify.getSongUrl(query);
      } else if (userType === 'yt' || (type === "spotify" && id)){
        return await this.youtube.getSongUrl(query);
      }
    } else {
      return [];
    }
  }

  private async linkCheck(link: string): Promise<{ type: LinkType; id: string | null }> {
    const youtubePattern = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|music\/watch\?v=))([^&?/]+)/;
    const spotifyPattern = /(?:spotify\.com\/track\/)([^&?/]+)/;

    let match = link.match(youtubePattern);
    if (match) {
      return { type: LinkType.Youtube, id: match[1] };
    }

    match = link.match(spotifyPattern);
    if (match) {
      return { type: LinkType.Spotify, id: match[1] };
    }

    return { type: LinkType.Unknown, id: null };
  }
}
