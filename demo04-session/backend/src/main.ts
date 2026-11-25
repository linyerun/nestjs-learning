import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api'); // 给请求路径加个公共前缀
  app.use(
    session({
      secret: '加盐',
      name: 'lyr.sid', //生成客户端cookie的名字
      rolling: true, // 在每次请求时强行设置 cookie，这将重置 cookie 过期时间(默认:false)
      cookie: { maxAge: 30 * 60 * 1000 }, // 设置返回到前端 key 的属性
      resave: false, // 是否强制在每次请求结束后都重新保存 Session，即使这次请求中 Session 数据根本没有被修改过。
      saveUninitialized: false, // 是否强制保存一个“未初始化”的空 Session。比如一个用户只是来逛了逛，没有登录，系统是否也要为它创建一个 Session 记录并分配 Cookie。
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
