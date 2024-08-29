import { Ctx, Update, On } from "nestjs-telegraf";
import { Scenes, Telegraf } from "telegraf";
import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import { YoutubeService } from "src/yt/yt.service";
import { ConfigService } from "@nestjs/config";
import { SpotifyService } from "src/spotify/spotify.service";

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
    
    constructor(
        private readonly config: ConfigService,
        private readonly youtube: YoutubeService,
        private readonly spotify: SpotifyService
    ) {
        super(config.get('TELEGRAM_TOKEN'),)
    }

    @On('inline_query')
    async onMessage(@Ctx() ctx: Context) {
        const query = ctx.inlineQuery.query;


        const results = await this.getQueryResults(query);
        await ctx.answerInlineQuery(results, {button: {text: "Change your", start_parameter: "test"}});
    }

    private async getQueryResults(query: string, ): Promise<InlineQueryResultArticle[]> {

        const type = await this.linkCheck(query);


        // await this.spotify.getSongUrl(query);
        // const results: InlineQueryResultArticle[] = await this.youtube.getSongUrl(query);

        const results: InlineQueryResultArticle[] = await this.spotify.getSongUrl(query);


        return results;
    }

    private async linkCheck(link: string): Promise<string> {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|music\.youtube\.com)\/.+$/;
        const spotifyRegex = /^(https?:\/\/)?(open\.)?(spotify\.com)\/.+$/;

        if (youtubeRegex.test(link)) {
            return 'Youtube';
        } else if (spotifyRegex.test(link)) {
            return 'Spotify';
        } else {
            return 'Unknown'
        }
    }

}

