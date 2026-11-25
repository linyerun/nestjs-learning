import { Global, Module } from '@nestjs/common';
import { UserDao } from '@/dao/user.js';

// 注册成全局的module, 还得往exports里面写, 在app.module.ts里面注册一下就可以随处使用了
@Global()
@Module({
  providers: [UserDao],
  exports: [UserDao],
})
export class DaoModule {}
