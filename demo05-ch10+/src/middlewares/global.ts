import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

export function Global(req: Request, resp: Response, next: NextFunction): any {
  console.log(`[Global]-${req.method}-${req.url}`);
  next();
}
