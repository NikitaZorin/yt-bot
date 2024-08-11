import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const bot = app.get(getBotToken());

  app.use(bot.webhookCallback('/'));

  console.log(bot);

  await app.listen(3000);
}
bootstrap();
