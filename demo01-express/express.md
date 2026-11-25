# 关于express实现原理说明
```ts
// 返回一个函数, 然后这个函数绑定了一些方法: use, get, post, put, delete
import express from 'express'
```
- 根据use、handler(get/post/put/delete)调用的先后顺序形成一个数组, use要求前缀匹配, handler要求精确匹配；
- 没命中的跳过, use和handler(一般我们不写next)都有next方法传入, 决定了是否继续往下匹配的,只有调用了next才会往下匹配；
- 另外如果配置的函数throw抛异常,会被最近一层的try/catch 抓住，自动转成 next(err)；之后进入“错误模式”——跳过所有普通层和路由，只找 4 个参数的错误中间件。
- 最后，我们传入的箭头函数可以是异步的也可以是同步的

```ts
import path from "node:path";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { usersRouter } from "./routes/users";

const app = express();

// 得出结果: 第三个中间件, 不调用next,不会继续往下执行了,然后在应用层任务就全部完成了
// 为什么在浏览器出现卡住的效果呢?
//  因为响应只有 res.end() 才真正发出去。res 是 socket 的包装，不写它，socket 就一直开着，客户端收不到任何字节，只能等
//  我们调用多次发生end()也会出问题报错的,比如: 调用两次res.json()
// 结束响应：调用 res.send() / res.json() / res.end() / res.redirect() 等
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("u1 prev");
  next();
  console.log("u1 next");
});
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("u2 prev");
  next();
  console.log("u2 next");
});
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("全局中间件");
  // 不调用next,看看请求是否会被阻塞
  // res.json({message: "1"})
  // res.json({message: "2"})
});
```