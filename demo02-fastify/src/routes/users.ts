import type { FastifyInstance } from "fastify";
import { AppError } from "../app-error";

/*
todo 说一下三种类型的schema
{ Querystring: { keyword?: string } }
{
  schema: {
    querystring: {
      type: "object",
      properties: {
        keyword: { type: "string" },
      },
    },
  },
}

{ Body: { name: string } }
{
  schema: {
    body: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", minLength: 1 },
      },
    },
  },
}

{ Params: { id: number } }
{
  schema: {
    params: {
      type: "object",
      properties: {
        id: { type: "integer" },
      },
      required: ["id"],
    },
    body: {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", minLength: 1 },
      },
    },
  },
}
* */

type User = {
  id: number;
  name: string;
};

// 内存里的“数据库”，重启服务后数据会重置
const users: User[] = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
];
let nextId = 3;

// 路径参数 id 的校验规则，下面几个接口都要用
const idParamsSchema = {
  type: "object",
  properties: {
    id: { type: "integer" },
  },
  required: ["id"],
};

// Fastify 插件就是一个函数：接收 app，在里面注册路由和钩子
// 入口文件用 app.register(usersRoutes, { prefix: '/api/users' }) 挂载它
export async function usersRoutes(app: FastifyInstance) {
  // 钩子（hook）相当于中间件，只对当前插件里的路由生效
  // preHandler 在进入处理函数之前执行；抛出的错误会进入统一错误处理
  app.addHook("preHandler", async (req) => {
    // 读操作不校验；写操作必须带 Authorization: Bearer demo-token
    if (req.method === "GET") {
      return;
    }

    if (req.headers.authorization !== "Bearer demo-token") {
      throw new AppError(
        401,
        "未授权：请在请求头带上 Authorization: Bearer demo-token",
      );
    }
  });

  // GET /api/users?keyword=张 —— 查询列表，可按名字过滤
  app.get<{ Querystring: { keyword?: string } }>(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            keyword: { type: "string" },
          },
        },
      },
    },
    async (req) => {
      const keyword = req.query.keyword ?? "";
      return keyword
        ? users.filter((user) => user.name.includes(keyword))
        : users;
    },
  );

  // GET /api/users/:id —— 路径参数通过 req.params 获取
  // schema 里声明 id 是 integer，Fastify 会自动把 URL 里的 "1" 转成数字 1
  app.get<{ Params: { id: number } }>(
    "/:id",
    {
      schema: {
        params: idParamsSchema,
      },
    },
    async (req) => {
      const user = users.find((item) => item.id === req.params.id);

      if (!user) {
        throw new AppError(404, "用户不存在");
      }

      return user;
    },
  );

  // POST /api/users —— 请求体格式：{ "name": "王五" }
  // schema 会自动校验请求体，不合法直接返回 400，处理函数根本不会执行
  app.post<{ Body: { name: string } }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (req, resp) => {
      const user = { id: nextId++, name: req.body.name };
      users.push(user);

      // resp.code(201) 设置状态码；201 表示创建成功
      return resp.code(201).send(user);
    },
  );

  // PUT /api/users/:id —— 更新用户
  app.put<{ Params: { id: number }; Body: { name: string } }>(
    "/:id",
    {
      schema: {
        params: idParamsSchema,
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1 },
          },
        },
      },
    },
    async (req) => {
      const user = users.find((item) => item.id === req.params.id);

      if (!user) {
        throw new AppError(404, "用户不存在");
      }

      user.name = req.body.name;
      return user; // todo我的注释 底层帮我们调用了resp.send(user), 或者我们自己在这个函数调用resp.send(user)
    },
  );

  // DELETE /api/users/:id —— 删除用户
  app.delete<{ Params: { id: number } }>(
    "/:id",
    {
      schema: {
        params: idParamsSchema,
      },
    },
    async (req, resp) => {
      const index = users.findIndex((item) => item.id === req.params.id);

      if (index === -1) {
        throw new AppError(404, "用户不存在");
      }

      users.splice(index, 1);

      // 204 表示成功，但没有响应内容
      return resp.code(204).send(); // todo我的注释 我们调用"resp."之后就得写成return resp.xxx,不然会警告,不写也可以的
    },
  );
}
