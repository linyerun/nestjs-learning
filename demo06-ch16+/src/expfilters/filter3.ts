import {
  ArgumentsHost,
  BadGatewayException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadGatewayException) // 传参: 只拦截传入的异常
export class MyFilter3 implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const req = host.switchToHttp().getRequest<Request>();
    const resp = host.switchToHttp().getResponse<Response>();
    console.log(`[MyFilter3] Method Filter`);
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
