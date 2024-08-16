import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';
import { InlineQueryResultArticle } from "telegraf/typings/core/types/typegram";

@Injectable()
export class YoutubeService {
    private apiKey: string;

    constructor(private configService: ConfigService) {
        this.apiKey = this.configService.get('YT_API_KEY')
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
 
            response.data.items.forEach(video => {
                result.push({
                    type: "article",
                    id: video.id.videoId,
                    title: video.snippet.title,
                    input_message_content: {
                        message_text: `https://www.youtube.com/watch?v=${video.id.videoId}`
                    },
                    thumbnail_url: video.snippet.thumbnails.medium.url,
                });
            });

            return result;
        } catch (error) {
            console.error('Ошибка при получении URL видео:', error);
            throw new Error('Не удалось получить URL видео');
        }
    }
}