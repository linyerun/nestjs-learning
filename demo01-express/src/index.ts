import path from "node:path";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { usersRouter } from "./routes/users";

const app = express();

app.get("/a", (req, res, next) => {
  res.json({ message: "Hello World!" });
  // 不调用next, 后面都不会被执行
});

// 1. 全局中间件：每个请求都会经过这里
//    必须调用 next()，请求才会继续往下走
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  // 'finish' 在响应发送完成时触发，这里用来打印耗时
  res.on("finish", () => {
    console.log(
      `[INFO]${req.method} ${req.url} -> ${res.statusCode} (${Date.now() - start}ms)`,
    );
  });
  next();
});

// 2. 静态文件：public 目录里的文件可以直接通过 URL 访问
//    访问 / 时会自动返回 public/index.html
app.use(express.static(path.join(__dirname, "../public")));

// 3. 解析 JSON 请求体：没有它，req.body 就是 undefined
app.use(express.json());

// 4. 最普通的 GET 路由，支持查询参数 ?name=xxx
app.get("/api/hello", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const name = String(req.query.name ?? "world");
  res.send(`你好，${name}！`);
});

// 5. 重定向
app.get("/api/redirect", (req, res) => {
  res.redirect("/");
});

// 6. 把 users 相关的路由挂载到 /api/users 下面
app.use("/api/users", usersRouter);

// 7. 故意抛错的接口，用来演示错误处理中间件
//    在 Express 5 中，async 函数里抛出的错误也会被自动捕获
app.get("/api/boom", () => {
  throw new Error("这是一个示例错误");
});

// 8. 404：上面的路由都没有匹配到时，才会走到这里
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `找不到 ${req.method} ${req.originalUrl}` });
});

// 9. 错误处理中间件：必须写 4 个参数，Express 才会把它当成错误处理器
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error("出错了：", err.message);
  res.status(500).json({ message: "服务器内部错误", detail: err.message });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}`);
});
