import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from '@/app.controller.js';
import { AppService } from '@/app.service.js';
import { CtlModule } from '@/controller/ctl.module.js';
import { DaoModule } from '@/dao/dao.module.js';
import { DyModule } from '@/dynamic/dy.module.js';
import { User } from '@/controller/user.js';
import { Logger } from '@/middlewares/logger.js';

@Module({
  imports: [
    CtlModule,
    DaoModule,
    DyModule.dynamicModule({ path: '/va', name: 'lyr' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // 注册中间件
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes('user'); // 路径前缀匹配, 里面接收到的uri被去掉这个前缀了
    // 路径前缀 + 请求方法
    consumer.apply(Logger).forRoutes(
      {
        path: 'user/1', // 精确匹配
        method: RequestMethod.GET,
      },
      {
        path: 'user/2', // 精确匹配
        method: RequestMethod.GET,
      },
      {
        path: 'user/api/{*splat}', // 去掉"{}"就不能匹配"/user/api", 匹配"user/api/"开头的全部路径
        method: RequestMethod.GET, // 请求方法必须是GET
      },
    );
    consumer.apply(Logger).forRoutes(User); // 传控制器去匹配
  }
}
