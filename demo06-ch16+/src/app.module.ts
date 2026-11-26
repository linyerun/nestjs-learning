import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Interceptor3 } from '@/interceptors/interceptor3.js';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    // todo 注册全局拦截器(比我们使用useGlobalInterceptors注册的优势在于可以注入自动注入依赖)
    {
      provide: APP_INTERCEPTOR,
      useClass: Interceptor3,
    },
  ],
})
export class AppModule {}
