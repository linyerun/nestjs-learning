import { Controller, Get, Inject } from '@nestjs/common';
import { LyrService } from '@/service/lyr.js';
import { UserDao } from '@/dao/user.js';

@Controller('user')
export class User {
  constructor(
    @Inject('lyrSvc') public lyrService: LyrService,
    public userDao: UserDao,
    @Inject('val') public dyVal: any,
  ) {}

  @Get('/1')
  get() {
    return this.lyrService.get();
  }

  @Get('/2')
  get2() {
    return this.userDao.get();
  }

  @Get('/3')
  get3() {
    return this.dyVal;
  }
}
