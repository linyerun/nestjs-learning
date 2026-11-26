import { Controller, Get, Res, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service.js';
import type { Response } from 'express';
import { Interceptor1 } from '@/interceptors/interceptor1.js';
import { Interceptor2 } from '@/interceptors/interceptor2.js';

/*
- 一个类会被别的类 constructor 注入 → 加 @Injectable();
- 这个类只有本模块用 → 放进本模块 providers，到此为止；
- 别的模块也要用 → 本模块 providers + exports，对方模块 imports: [当前模块]
---
- 一个类构造器上依赖别的类  → 加 @Injectable();
- 如果这个类不被别人依赖无需写到providers上
* */

@UseInterceptors(Interceptor1) // todo 写到这里的拦截器不使用@Injectable装饰也行
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseInterceptors(Interceptor2) // 拦截器可以加给特定方法
  @Get('/name')
  getName(@Res() resp: Response) {
    // todo 不写return, 我们的拦截器接收到的data就是undefined
    /*
      1. @Res()（不带 passthrough）= 声明"响应归我管"。Nest 在 router-execution-context.js:480
         计算 isResponseHandled = 有 @Res/@Next && 未开 passthrough，你这里为 true。

      2. 拦截器链照样跑、照样被订阅。:116-118 拿到 observable 后，transformToResult 用 lastValueFrom() 驱动整条链（router-response-controller.js:286）。
         所以你的 map 必然执行——handler 没 return，data 就是 undefined，打印后包成 {data: undefined, code: 200, message: 'success'}。

      3. 写响应这一步被守卫掉了。:340 是 if (!isResponseHandled) { … apply(result, res) … }。isResponseHandled === true，整个 res.json() 分支跳过，
         拦截器加工出的对象直接丢弃。Nest 从头到尾只发了一次响应（你 handler 里那次），所以没有 Cannot set headers after they are sent。

      4. 时序：resp.json() 在 handler 里先同步发完；之后 map 才执行，它只读了 resp.statusCode（读属性不会报错），没有第二次写。

      尝试: @Res({ passthrough: true }), 会报错, 因为不能二次像客户端写数据了
    * */
    resp.json({ name: 'linyerun' });
  }
}
