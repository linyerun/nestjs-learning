import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { tap, type Observable } from 'rxjs';
import { Request, Response } from 'express';
import { AppService } from '@/app.service.js';

@Injectable()
export class Interceptor3<T = any> implements NestInterceptor {
  constructor(private readonly appService: AppService) {
    console.log('[Interceptor3] Interceptor3被创建了');
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    console.log(
      `[Interceptor3] - AppService被调用: ${this.appService.getHello()}`,
    );
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const resp = context.switchToHttp().getResponse<Response>();
    // tap对流中发出的每个值执行一个回调，但不修改值本身，原样把值传给下游。
    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `[Interceptor3] - ${req.method} - ${req.url}] - ${resp.statusCode} - ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
