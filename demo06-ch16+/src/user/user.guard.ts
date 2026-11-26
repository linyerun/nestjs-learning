import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { User } from './user.decorator.js';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // 获取我们自定义注解装饰在类还有方法上的参数

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data1 = this.reflector.get(User, context.getHandler()); //获取方法上的
    const data2 = this.reflector.get(User, context.getClass()); // 获取类上的
    const arr = [];
    if (data1) {
      arr.push(...data1);
      console.log(`[UserGuard] method-metadata=${data1}`);
    }
    if (data2) {
      arr.push(...data2);
      console.log(`[UserGuard] class-metadata=${data2}`);
    }
    console.log(`[UserGuard] all-metadata=${arr}`);
    const req = context.switchToHttp().getRequest<Request>();
    if (req.headers.cookie) {
      return req.headers.cookie.includes('lyr-token');
    }
    return false;
  }
}
