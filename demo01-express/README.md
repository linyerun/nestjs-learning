# demo01-express

用 TypeScript 写的最小 Express 示例，覆盖日常最常用的功能，代码按"从上到下"的顺序加了注释。

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
| 全局中间件（打印请求日志） | `src/index.ts` 第 1 步 |
| 静态文件 `express.static` | `src/index.ts` 第 2 步 + `public/index.html` |
| JSON 请求体解析 `express.json` | `src/index.ts` 第 3 步 |
| 查询参数 `req.query` | `GET /api/hello`、`GET /api/users?keyword=` |
| 重定向 `res.redirect` | `GET /api/redirect` |
| 路由模块化 `express.Router` | `src/routes/users.ts` |
| 路由级中间件（简单鉴权） | `usersRouter.use(...)` |
| 路径参数 `req.params` | `GET/PUT/DELETE /api/users/:id` |
| REST 增删改查 + 状态码 | `src/routes/users.ts` |
| 错误演示 | `GET /api/boom` |
| 404 处理 | `src/index.ts` 第 8 步 |
| 错误处理中间件（4 个参数） | `src/index.ts` 第 9 步 |

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

# 删除
curl -X DELETE http://localhost:3000/api/users/2 \
  -H "Authorization: Bearer demo-token"

# 不带 token 会返回 401
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"王五"}'

# 错误处理、404
curl http://localhost:3000/api/boom
curl http://localhost:3000/api/not-exist
```

## 两个关键规则

1. **中间件按注册顺序执行**，调用 `next()` 才会进入下一个。
2. **错误处理中间件必须写 4 个参数** `(err, req, res, next)`，否则 Express 会把它当普通中间件。