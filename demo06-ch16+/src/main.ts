import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { JsonFormat } from '@/interceptors/jsonformat.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局的过滤器无法实现依赖注入
  app.useGlobalInterceptors(new JsonFormat());
  // app.useGlobalFilters()
  // app.useGlobalGuards()
  // app.useGlobalPipes()
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
