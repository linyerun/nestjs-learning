import { Module } from '@nestjs/common';
import { User } from '@/controller/user.js';
import { SvcModule } from '@/service/svc.module.js';

@Module({
  imports: [SvcModule],
  controllers: [User],
})
export class CtlModule {}
