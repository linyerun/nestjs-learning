# demo02-fastify

用 TypeScript 写的最小 Fastify 示例，覆盖日常最常用的功能，代码按"从上到下"的顺序加了注释。可以对照 `demo01-express` 看看同一件事在两种框架里怎么写。

处理函数里的 `req` / `resp` 只是本地变量名（Fastify 文档习惯写 `request` / `reply`），怎么命名都不影响框架行为；这里用短名字是为了贴近 Express 的习惯。

## 运行

```bash
npm install
npm run dev        # 开发模式：改代码自动重启
```

打开 http://localhost:3000 即可看到演示页。

生产模式：

```bash
npm run build      # 编译到 dist/
npm start          # 运行编译后的代码
```

数据存在内存里，重启服务后会重置。

## 功能与代码位置

| 功能 | 位置 |
| --- | --- |
| 内置日志（pino，开发时用 pino-pretty 美化） | `src/index.ts` 第 1 步 |
| 统一错误处理 `setErrorHandler` | `src/index.ts` 第 2 步 |
| 404 处理 `setNotFoundHandler` | `src/index.ts` 第 3 步 |
| CORS 跨域插件 `@fastify/cors` | `src/index.ts` 第 4 步 |
| 静态文件 `@fastify/static` | `src/index.ts` 第 5 步 + `public/index.html` |
| 查询参数 `req.query` + querystring schema | `GET /api/hello` |
| 重定向 `resp.redirect` | `src/index.ts` 第 7 步 |
| 路由模块化 `register` + `prefix` | `src/index.ts` 第 8 步 + `src/routes/users.ts` |
| 钩子鉴权 `preHandler` | `src/routes/users.ts` |
| 路径参数 `req.params` + params schema | `GET/PUT/DELETE /api/users/:id` |
| JSON Schema 请求体校验 | `POST/PUT /api/users` |
| REST 增删改查 + 状态码 | `src/routes/users.ts` |
| 自定义带状态码错误 `AppError` | `src/app-error.ts` |
| 错误演示 | `GET /api/boom` |
| TypeScript 类型（路由泛型） | `app.get<{ Querystring: ... }>` 这类写法 |

## 用 curl 测试

```bash
# 查询参数（--data-urlencode 会自动处理中文编码）
curl -G --data-urlencode "name=小王" http://localhost:3000/api/hello

# 列表 + 按名字搜索
curl http://localhost:3000/api/users
curl -G --data-urlencode "keyword=张" http://localhost:3000/api/users

# 创建（写操作要带 token）
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{"name":"王五"}'

# 更新
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{"name":"张三丰"}'

# 删除（成功返回 204，没有响应内容）
curl -X DELETE http://localhost:3000/api/users/2 \
  -H "Authorization: Bearer demo-token"

# 不带 token 会返回 401
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"王五"}'

# schema 校验失败会返回 400（缺少 name / id 不是数字）
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{}'
curl http://localhost:3000/api/users/abc

# 错误处理、404、重定向
curl http://localhost:3000/api/boom
curl http://localhost:3000/api/not-exist
curl -i http://localhost:3000/api/redirect

# 跨域响应头（CORS）
curl -i -H "Origin: http://example.com" http://localhost:3000/api/hello
```

## Fastify 和 Express 的几个关键区别

1. **返回值就是响应**：`return user` 等价于 `res.json(user)`，不用手动 `res.send`。
2. **插件 + prefix 代替 `app.use(path, router)`**：`app.register(usersRoutes, { prefix: '/api/users' })`。
3. **钩子（hooks）代替中间件**：`preHandler` 在处理函数之前执行，在里面抛错会直接进入错误处理。
4. **JSON Schema 自动校验**：请求不合法直接返回 400，处理函数根本不会执行。
5. **错误处理只写一个 `setErrorHandler`**：没有 Express"必须写 4 个参数"的规则。
6. **日志内置**：每个请求自动打印 incoming request / request completed 和耗时。
7. **`listen` 必须传对象**：`app.listen({ port, host })`，不能再写 `app.listen(3000)`。

## 两个小提醒

- 校验失败的 `detail` 是 AJV 给出的英文报错，方便定位是哪个字段不合法。
- 写操作固定要求 `Authorization: Bearer demo-token`，只是演示鉴权放在哪里，不是真正的登录方案。