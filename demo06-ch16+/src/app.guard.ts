import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppService } from '@/app.service.js';

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private appService: AppService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log(`[AppGuard] - ${this.appService.getHello()}`);
    return true;
  }
}
