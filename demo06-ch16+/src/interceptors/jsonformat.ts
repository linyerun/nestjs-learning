import {
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import { Request, Response } from 'express';

interface Data<T> {
  data: T;
  code: number;
  message: string;
}

export class JsonFormat<T = any> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Data<T>> {
    const req = context.switchToHttp().getRequest<Request>();
    const resp = context.switchToHttp().getResponse<Response>();
    console.log(`[JsonFormatInterceptor] - ${req.method} - ${req.url}]`);
    return next.handle().pipe(
      map((data) => {
        console.log(data);
        return {
          data: data,
          code: resp.statusCode,
          message: 'success',
        };
      }),
    );
  }
}
