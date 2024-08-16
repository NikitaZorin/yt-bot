import { Ctx, Update, On } from "nestjs-telegraf";
import { Scenes, Telegraf } from "telegraf";
import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";
import { YoutubeService } from "src/yt/yt.service";
import { ConfigService } from "@nestjs/config";

type Context = Scenes.SceneContext;

@Update()
export class TelegramService extends Telegraf<Context> {
    
    constructor(
        private readonly config: ConfigService,
        private readonly youtube: YoutubeService
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


        const results: InlineQueryResultArticle[] = await this.youtube.getSongUrl(query);



        // let msgRes = "";

        // if (type === "youtube") {
        //     msgRes = "In Progress";
        // } else if (type === "spotify") {
        //     // msgRes = "In Progress";
        // } else {
        //   msgRes = await this.youtube.getSongUrl(query);
        // }

        // const results: InlineQueryResultArticle[] = [
        //     { type: 'article', id: "1", title: "Send your youtube/spotify link", input_message_content: { message_text: msgRes  }, thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png" },
        //     { type: 'article', id: "2", title: "Search youtube/spotify song by name", input_message_content: { message_text: msgRes  }, thumbnail_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1982px-Spotify_icon.svg.png" }
        // ];
        // const results: InlineQueryResultArticle[] = [];
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

