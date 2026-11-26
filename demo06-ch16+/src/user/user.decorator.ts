import { Reflector } from '@nestjs/core';
import {
  createParamDecorator,
  applyDecorators,
  ExecutionContext,
  Get,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import type { Request } from 'express';
import { MethodGuard } from '@/method.guard.js';
import { MyFilter3 } from '@/expfilters/filter3.js';

// 通过nestjs/core包创建装饰器, 能同时修饰"类"和"方法", 用于预设一些信息, 与guard配合使用
// ts类型层面做了兼容
export const User = Reflector.createDecorator<string[]>();

// 提取参数, 用于controller的方法的参数上
// data: 我们可以传进来的内容, ctx: 上下文信息
// 作用: 从'body' | 'query' | 'params'获取key的值，没有就设置为defaultVal, 生成的装饰器还是可以继续在后面传管道
export const UserParams = createParamDecorator(
  (
    [type, key, defaultVal]: ['body' | 'query' | 'params', string, any],
    ctx: ExecutionContext,
  ) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req[type][key] ?? defaultVal;
  },
);

// 组合装饰器
// 装饰器组合的核心价值在于将分散的、重复的装饰器逻辑打包成一个具有业务语义的自定义装饰器。
// 使用限制: 所有装饰器装饰都能装饰待装饰位置，不能乱来
export const CombineDecorators = applyDecorators(
  Get('/decorator2'),
  UseGuards(MethodGuard),
  UseFilters(MyFilter3),
);
