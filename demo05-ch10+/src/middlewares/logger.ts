import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable() //注释掉这个注解也不会报错
export class Logger implements NestMiddleware {
  use(req: Request, resp: Response, next: NextFunction) {
    console.log(`[Logger][${req.method}] ${req.url}`);
    next();
  }
}
