import { Controller } from '@nestjs/common';
import { InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';
import { SpotifyService } from '../spotify.service';

@Controller('spotify')
export class SpotifyController {
  constructor(private readonly appService: SpotifyService) {}

  getSongUrl(title: string): Promise<InlineQueryResultArticle[]> {
    return this.appService.getSongUrl(title);
  }
}
