import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI, // 在uri上携带api版本
    prefix: 'v', // 默认前缀是v
  });
  app.setGlobalPrefix('/api'); // 给请求路径加个公共前缀
  app.enableCors(); // 允许跨域
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
