import { Injectable } from '@nestjs/common';
import { InlineQueryResult } from 'telegraf/typings/core/types/typegram';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';


@Injectable()
export class TelegramService {
    constructor(@InjectBot() private bot: Telegraf<Context>) {}

    async onMuduleInit() {
        const bot = this.bot;
        
        bot.on('inline_query', async (ctx: Context) => {
            const query = ctx.inlineQuery.query;

            console.log(query);

            await ctx.answerInlineQuery([]);
        })
    }
}
