import express, { type Express, type Request, type Response } from "express";
import {
  CONTROLLER_PREFIX,
  MODULE_META,
  PARAM_META,
  ROUTES,
  type Class,
  type ModuleMeta,
  type ParamMeta,
  type RouteMeta,
} from "./decorators";
import { Container } from "./container";

// 对应 NestFactory.create：读模块元数据 -> 实例化 -> 把控制器方法绑到 Express 路由
export function createApp(AppModule: Class): Express {
  const moduleMeta: ModuleMeta = Reflect.getMetadata(
    MODULE_META,
    AppModule,
  ) ?? {
    controllers: [],
    providers: [],
  };

  const container = new Container();
  // 预热 provider，等价于 Nest 的依赖扫描（单例只 new 一次）
  moduleMeta.providers.forEach((provider) => container.resolve(provider));

  const app = express();
  app.use(express.json()); // @Body() 依赖它

  for (const Ctrl of moduleMeta.controllers) {
    const prefix: string = Reflect.getMetadata(CONTROLLER_PREFIX, Ctrl) ?? "";
    const routes: RouteMeta[] = Reflect.getMetadata(ROUTES, Ctrl) ?? [];
    const instance = container.resolve(Ctrl);

    for (const route of routes) {
      const fullPath = "/" + [prefix, route.path].filter(Boolean).join("/");
      type Register = (
        path: string,
        handler: (req: Request, res: Response) => Promise<void>,
      ) => void;
      // 必须先 bind(app)：Express 的路由方法内部依赖 this
      const register = (app[route.method] as Register).bind(app);

      register(fullPath, async (req, res) => {
        try {
          const args = resolveArgs(req, Ctrl, route.handler); // 从req中取参数
          const result = await (instance as any)[route.handler](...args);
          res.json(result);
        } catch (err) {
          res.status(500).json({ error: (err as Error).message });
        }
      });
    }
  }

  return app;
}

// 按参数装饰器记录的 index/source，从 req 中取值填进调用参数
function resolveArgs(
  req: Request,
  Ctrl: Class,
  handler: string | symbol,
): unknown[] {
  const params: ParamMeta[] =
    Reflect.getMetadata(PARAM_META, Ctrl, handler) ?? [];
  const args: unknown[] = [];
  for (const p of params) {
    const source = (req as any)[p.source];
    args[p.index] = p.name === undefined ? source : source?.[p.name];
  }
  return args;
}
