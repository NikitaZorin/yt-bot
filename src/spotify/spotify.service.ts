import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as SpotifyWebApi from 'spotify-web-api-node';
import { TokenDocument, Token } from './schemas/token.schema';
import { InlineQueryResultArticle } from 'telegraf/typings/core/types/typegram';

@Injectable()
export class SpotifyService {
  private spotifyApi: SpotifyWebApi;

  constructor(
    private readonly config: ConfigService,
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
  ) {
    this.spotifyApi = new SpotifyWebApi({
      clientId: config.get('SPOTIFY_CLIENT_ID'),
      clientSecret: config.get('SPOTIFY_CLIENT_SECRET'),
    });
  }

  async getSongUrl(title: string): Promise<InlineQueryResultArticle[]> {
    await this.getAccessToken();

    try {
      const data = await this.spotifyApi.searchTracks(`track:${title}`, {
        limit: 5,
      });

      const result: InlineQueryResultArticle[] = [];

      data.body.tracks.items.forEach((song) => {
        result.push({
          type: 'article',
          id: song.id,
          title: `${song.artists[0].name} - ${song.name}`,
          input_message_content: {
            message_text: song.external_urls.spotify,
          },
          thumbnail_url: song.album.images[0].url,
        });
      });

      return result;
    } catch (error) {
      console.error('Ошибка при получении URL видео:', error);
      throw new Error('Не удалось получить URL видео');
    }
  }

  private async getAccessToken(): Promise<string> {
    let token = await this.tokenModel.findOne();
    if (
      !token ||
      new Date().getTime() - token.createdAt.getTime() >= token.expiresIn * 1000
    ) {
      const res = await this.spotifyApi.clientCredentialsGrant();
      const tokenData = res.body;

      if (token) {
        token.accessToken = tokenData.access_token;
        token.expiresIn = tokenData.expires_in;
        token.createdAt = new Date();
      } else {
        token = new this.tokenModel({
          accessToken: tokenData.access_token,
          expiresIn: tokenData.expires_in,
          createdAt: new Date(),
        });
      }

      await token.save();
      this.spotifyApi.setAccessToken(tokenData.access_token);

      return tokenData.access_token;
    } else {
      // Используем существующий токен
      this.spotifyApi.setAccessToken(token.accessToken);
      return token.accessToken;
    }
  }
}
