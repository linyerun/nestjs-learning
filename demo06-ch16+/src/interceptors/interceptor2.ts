import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { tap, type Observable } from 'rxjs';
import { Request, Response } from 'express';

export class Interceptor2<T = any> implements NestInterceptor {
  constructor() {
    console.log('[Interceptor2] Interceptor2被创建了');
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const resp = context.switchToHttp().getResponse<Response>();
    // tap对流中发出的每个值执行一个回调，但不修改值本身，原样把值传给下游。
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `[Interceptor2] - ${req.method} - ${req.url}] - ${resp.statusCode} - ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
