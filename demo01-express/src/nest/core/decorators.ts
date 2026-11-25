import "reflect-metadata";

// 装饰器只负责把配置写进元数据，真正的装配在 application.ts 里读取
export const CONTROLLER_PREFIX = Symbol("mini-nest:controller");
export const ROUTES = Symbol("mini-nest:routes");
export const PARAM_META = Symbol("mini-nest:params");
export const MODULE_META = Symbol("mini-nest:module");
export const INJECT_META = Symbol("mini-nest:inject");

export type Class<T = any> = new (...args: any[]) => T; //描述一个“类构造器类型”

export type ParamSource = "params" | "query" | "body";

export interface ParamMeta {
  index: number;
  source: ParamSource;
  name?: string;
}

export interface RouteMeta {
  method: "get" | "post";
  path: string;
  handler: string | symbol;
}

export interface ModuleMeta {
  controllers: Class[];
  providers: Class[];
}

// 空装饰器。真正的用途是让 TS 为构造函数发射 design:paramtypes，
// 容器才能从元数据里知道该 new 什么依赖
export function Injectable(): ClassDecorator {
  return () => {};
}

// 对标 Nest 的 @Inject：显式声明构造参数要注入哪个类。
// tsx/esbuild 不发射 design:paramtypes 时靠它兜底；接口类型也只能这样指定
// todo我的注释, 相当于把需要注入的对象的构造方法信息挂考在构造函数上，有点绕
export function Inject(token: Class): ParameterDecorator {
  return (target, key, index) => {
    // 构造参数装饰器的 target 就是类本身，key 为 undefined
    if (key !== undefined) {
      throw new Error("@Inject 目前只支持构造参数");
    }
    const deps: Class[] = Reflect.getMetadata(INJECT_META, target) ?? [];
    deps[index] = token; //js的数组很有意思, 不会出现什么超下标的因为本质上是数组是一个对象,key为number类型
    Reflect.defineMetadata(INJECT_META, deps, target);
  };
}

export function Controller(prefix = ""): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_PREFIX, prefix, target);
  };
}

function routeDecorator(
  method: RouteMeta["method"],
): (path?: string) => MethodDecorator {
  return (path = "") =>
    (target, key) => {
      // 方法装饰器的 target 是原型，元数据统一挂到构造器（类）上
      // 而原型上的constructor属性执行函数(这个函数的原型就是target)
      const routes: RouteMeta[] =
        Reflect.getMetadata(ROUTES, target.constructor) ?? [];
      routes.push({ method, path, handler: key });
      Reflect.defineMetadata(ROUTES, routes, target.constructor);
    };
}

export const Get = routeDecorator("get");
export const Post = routeDecorator("post");

function paramDecorator(
  source: ParamSource,
  name?: string,
): ParameterDecorator {
  return (target, key, index) => {
    // 构造参数上的装饰器不支持，直接忽略
    if (key === undefined) return;
    const params: ParamMeta[] =
      Reflect.getMetadata(PARAM_META, target.constructor, key) ?? [];
    // 按参数下标记录，调用时再按下标填回 args
    params.push({ index, source, name });
    Reflect.defineMetadata(PARAM_META, params, target.constructor, key);
  };
}

// 不传 name 时取整个对象（req.params / req.query / req.body）
export const Param = (name?: string) => paramDecorator("params", name);
export const Query = (name?: string) => paramDecorator("query", name);
export const Body = () => paramDecorator("body");

export function Module(meta: ModuleMeta): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(MODULE_META, meta, target);
  };
}
