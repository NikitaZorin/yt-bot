import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Token, TokenSchema } from './schemas/token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SpotifyController } from './controllers/spotify.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
      },
    ]),
  ],
  providers: [SpotifyService],
  exports: [SpotifyService, MongooseModule],
  controllers: [SpotifyController],
})
export class SpotifyModule {}
