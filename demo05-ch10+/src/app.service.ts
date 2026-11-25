import { Injectable, Scope } from '@nestjs/common';

/*
`scope`: 设定 Provider 的 DI 上下文生命周期，
         DEFAULT = 全局单例、REQUEST = 绑定请求上下文(每一次请求都新建一套实例，请求结束后销毁回收)、
         TRANSIENT = 每次注入新建实例；作用域沿依赖链传递。
`durable`: REQUEST 专属标记，搭配自定义 ContextId 策略，支持多请求共享同一个 ContextId，
           复用同一套 DI 子树，避免每条请求反复重建依赖树，用于分组隔离场景（典型多租户）。

一般都是按默认的来, 下面就是默认的

注释掉这个对象也可以被注入到AppController, 是否能被注入取决于是否写入@Module的provider
* */
let cnt = 1;
@Injectable({
  scope: Scope.DEFAULT,
  durable: undefined,
})
export class AppService {
  constructor() {
    console.log('AppService, 我被创建了: ', cnt, '次');
    cnt++;
  }
  getHello(): string {
    return 'Hello World!';
  }
}
