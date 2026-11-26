import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
import { Interceptor3 } from '@/interceptors/interceptor3.js';
import { MyFilter1 } from '@/expfilters/filter1.js';
import { UserController } from '@/user/user.controller.js';
import { AppGuard } from '@/app.guard.js';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [
    AppService,
    // todo 注册全局拦截器/异常过滤器/守卫(比我们使用useGlobalInterceptors注册的优势在于可以注入自动注入依赖)
    {
      provide: APP_INTERCEPTOR,
      useClass: Interceptor3,
    },
    {
      provide: APP_FILTER,
      useClass: MyFilter1,
    },
    {
      provide: APP_GUARD,
      useClass: AppGuard,
    },
  ],
})
export class AppModule {}
