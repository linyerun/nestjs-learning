import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { Global } from '@/middlewares/global.js';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(Global); // 全局路由
  // 意思是: join(import.meta.dirname, '../resources') + uri去掉"/resources"前缀 得到目标文件路径
  app.useStaticAssets(join(import.meta.dirname, '../resources'), {
    prefix: '/resources',
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();

// https://docs.nestjs.cn/overview/middlewares 详细看这里
