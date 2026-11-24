import path from "node:path";
import Fastify, { type FastifyError } from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import { usersRoutes } from "./routes/users";

// 1. 创建应用：logger 是 Fastify 内置的（基于 pino），不用自己写日志中间件
//    pino-pretty 只是把 JSON 日志变彩色，方便开发时看
const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { translateTime: "HH:MM:ss", ignore: "pid,hostname" },
    },
  },
});

// 2. 统一错误处理：所有路由（包括插件里的）抛出的错误都会来到这里
//    参数名和个数没有规定，不像 Express 必须写 4 个参数
app.setErrorHandler<FastifyError>((error, req, resp) => {
  // schema 校验失败时，Fastify 会把原因放在 error.validation
  if (error.validation) {
    return resp.code(400).send({
      message: "请求参数校验失败",
      detail: error.message,
    });
  }

  const statusCode = error.statusCode ?? 500;

  if (statusCode >= 500) {
    // 500 一般是代码 bug：记日志，给调用方一个统一提示
    req.log.error(error);
    return resp
      .code(500)
      .send({ message: "服务器内部错误", detail: error.message });
  }

  // 4xx：AppError 里写的提示可以直接返回给调用方
  return resp.code(statusCode).send({ message: error.message });
});

// 3. 404：以上路由都没匹配到时才走到这里
app.setNotFoundHandler((req, resp) => {
  return resp.code(404).send({ message: `找不到 ${req.method} ${req.url}` });
});

// 4. 插件：Fastify 的功能都通过 register 注册
//    CORS 让别的域名下的前端也能调用这些接口
app.register(cors, { origin: true });

// 5. 静态文件：访问 / 时返回 public/index.html
app.register(fastifyStatic, {
  root: path.join(__dirname, "../public"),
});

// 6. 普通路由：直接 return 的值就是响应内容
//    泛型里的 Querystring 用来给 req.query 加类型
app.get<{ Querystring: { name?: string } }>(
  "/api/hello",
  {
    schema: {
      querystring: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
    },
  },
  async (req, resp) => {
    req.log.info("hello 接口被调用");
    return resp
      .code(200)
      .send({ message: `你好，${req.query.name ?? "world"}！` });
  },
);

// 7. 重定向
app.get("/api/redirect", async (_req, resp) => {
  return resp.redirect("/");
});

// 8. 路由模块化：register + prefix，相当于 Express 的 app.use('/api/users', router)
app.register(usersRoutes, { prefix: "/api/users" });

// 9. 故意抛错，用来演示统一错误处理
app.get("/api/boom", async () => {
  throw new Error("这是一个示例错误");
});

// 10. 启动：Fastify 5 必须传对象，不能写 app.listen(3000)
const PORT = Number(process.env.PORT) || 3000;

app
  .listen({ port: PORT, host: "127.0.0.1" })
  .then(() => {
    console.log(`服务已启动：http://localhost:${PORT}`);
  })
  .catch((error) => {
    app.log.error(error);
    process.exit(1);
  });
