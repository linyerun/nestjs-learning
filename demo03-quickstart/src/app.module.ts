import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { RoleModule } from './role/role.module.js';

@Module({
  imports: [UserModule, RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
