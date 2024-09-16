import { Controller } from '@nestjs/common';
import { YoutubeService } from '../yt.service';
import { InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';

@Controller('yt')
export class YtController {
    constructor(private readonly appService: YoutubeService) {}

    getSongUrl(title: string): Promise<InlineQueryResultArticle[]> {
      return this.appService.getSongUrl(title);
    }
}
