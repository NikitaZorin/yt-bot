import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
// import { BotService } from './bot.service';
// import { UserModule } from '../user/user.module';

@Module({
    imports: [
        TelegrafModule.forRoot({
            token: process.env.BOT_TOKEN
        }),
    ],
    providers: []
})
export class BotModule {}