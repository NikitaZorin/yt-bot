import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class YoutubeService {
  private apiKey: string;

  constructor(private config: ConfigService) {
    this.apiKey = config.get('YT_API_KEY');
  }

  async getSongUrl(title: string): Promise<InlineQueryResultArticle[]> {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/search';

    try {
      const response = await axios.get(apiUrl, {
        params: {
          part: 'snippet',
          q: title,
          type: 'video', 
          maxResults: 5,
          key: this.apiKey,
        },
      });

      const result: InlineQueryResultArticle[] = [];

      response.data.items.forEach((video) => {
        result.push({
          type: 'article',
          id: video.id.videoId,
          title: video.snippet.title,
          input_message_content: {
            message_text: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          },
          thumbnail_url: video.snippet.thumbnails.medium.url,
        });
      });

      return result;
    } catch (error) {
      console.error(
        'Ошибка при получении URL видео:',
        JSON.stringify(error.response.data, null, 2),
      );
      throw new Error('Не удалось получить URL видео');
    }
  }

  async getSongTitle(id: string): Promise<string> {
    const apiUrl = 'https://www.googleapis.com/youtube/v3/videos';
  
    try {
      const response = await axios.get(apiUrl, {
        params: {
          part: 'snippet',
          id: id,
          key: this.apiKey,
        },
      });
  
      // Проверка, что видео найдено
      if (response.data.items.length === 0) {
        throw new Error('Видео с указанным ID не найдено');
      }
  
      // Возвращаем название видео
      return response.data.items[0].snippet.title;
    } catch (error) {
      console.error(
        'Ошибка при получении названия видео:',
        JSON.stringify(error.response.data, null, 2),
      );
      throw new Error('Не удалось получить название видео');
    }
  }
  
}
