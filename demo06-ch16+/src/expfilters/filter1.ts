import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch() // 传空就是拦截全部异常
export class MyFilter1 implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const req = host.switchToHttp().getRequest<Request>();
    const resp = host.switchToHttp().getResponse<Response>();
    console.log(`[MyFilter1] Global Filter`);
    console.log(exception);
    if (exception instanceof HttpException) {
      resp.json({
        message: exception.message,
        code: exception.getStatus(),
      });
      return;
    }
    resp.json({
      data: exception,
      message: '',
    });
    return;
  }
}
