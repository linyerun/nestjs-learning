import "reflect-metadata";
import { INJECT_META, type Class } from "./decorators";

// 对应 Nest 的 NestContainer + Injector：默认单例
export class Container {
  private instances = new Map<Class, any>();

  // T extends Class：T 必须是某种“可 new 的构造器类型”
  resolve<T extends Class>(target: T): InstanceType<T> {
    if (this.instances.has(target)) {
      return this.instances.get(target);
    }

    // x ?? default , 只有x是 null、undefined 才返回default
    // x || default , x是false、0、""、null、undefined、NaN都返回default

    // 两个来源：显式 @Inject 优先，回退到 tsc 发射的 design:paramtypes
    // （tsx/esbuild 不发射后者，所以 tsx 下构造依赖必须用 @Inject 标注）
    const explicit: (Class | undefined)[] =
      Reflect.getMetadata(INJECT_META, target) ?? [];
    const emitted: Class[] =
      Reflect.getMetadata("design:paramtypes", target) ?? [];

    // 按构造参数个数逐位合并，缺哪个参数就报哪个
    const deps = Array.from(
      { length: target.length },
      (_, i) => explicit[i] ?? emitted[i],
    );
    const missing = deps.findIndex((dep) => !dep);
    if (missing !== -1) {
      throw new Error(
        `${target.name} 第 ${missing} 个构造参数没有注入信息：` +
          `tsx/esbuild 不发射 design:paramtypes，请用 @Inject(SomeClass) 标注，` +
          `或用 tsc 编译并开启 experimentalDecorators、emitDecoratorMetadata`,
      );
    }

    // 先递归解析依赖，再 new —— 这就是控制反转
    const instance = new target(...deps.map((dep) => this.resolve(dep!)));
    this.instances.set(target, instance);
    return instance;
  }
}

/*
// 输出拆包传参
function f1(a: any, b: any, c: any) {
  console.log(a, b, c);
}
f1(...[1, 2, 3]);
*/
