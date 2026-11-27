import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller.js';
import { AppService } from '@/app.service.js';
import { UserModule } from './user/user.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql', //数据库类型
      username: 'root', //账号
      password: 'root123456', //密码
      host: 'localhost', //host
      port: 3306, //
      database: 'nest_crud', //库名
      // entities: [import.meta.dirname + '/**/*.entity{.ts,.js}'], // 查询实体文件(nest start 会先编译到 dist/ 再运行 dist/main.js，所以 import.meta.dirname = backend/dist。这行字符串实际是 backend/dist/**/*.entity{.ts,.js}。)
      synchronize: true, //是否自动将实体类同步到数据库
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 3, //重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中(只要实体在某处 forFeature 注册过，就自动进 DataSource，不用维护 glob 或手工清单。)
      //entities、autoLoadEntities+TypeOrmModule.forFeature两种方式各自都能让 User 生效，合并也不会重复。原因是 EntityMetadataBuilder.build() 是拿全局元数据存储按 target 集合过滤的，同一个类出现两次也只过滤出一次。
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
