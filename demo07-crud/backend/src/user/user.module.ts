import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entities/user.entity.js';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { Tag } from '@/entities/tag.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([User, Tag])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
