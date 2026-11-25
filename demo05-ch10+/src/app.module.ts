import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller.js';
import { AppService } from '@/app.service.js';
import { CtlModule } from '@/controller/ctl.module.js';
import { DaoModule } from '@/dao/dao.module.js';
import { DyModule } from '@/dynamic/dy.module.js';

@Module({
  imports: [
    CtlModule,
    DaoModule,
    DyModule.dynamicModule({ path: '/va', name: 'lyr' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
