import { Reflector } from '@nestjs/core';

// 通过nestjs/core包创建装饰器, 能同时修饰类和方法
// ts类型层面做了兼容
export const User = Reflector.createDecorator<string[]>();
