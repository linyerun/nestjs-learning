import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Global } from '@/middlewares/global.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(Global); // 全局路由
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

// https://docs.nestjs.cn/overview/middlewares 详细看这里
