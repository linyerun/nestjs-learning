import {
  Controller,
  Get,
  BadRequestException,
  BadGatewayException,
  UseFilters,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MyFilter2 } from '@/expfilters/filter2.js';
import { MyFilter3 } from '@/expfilters/filter3.js';
import { GenUserIdPipe } from '@/user/user.pipe.js';
import { UserGuard } from '@/user/user.guard.js';
import { MethodGuard } from '@/method.guard.js';
import { User } from './user.decorator.js';

@User(['UserController'])
@UseGuards(UserGuard)
@UseFilters(MyFilter2)
@Controller('user')
export class UserController {
  @Get('/1')
  get1() {
    throw new BadRequestException();
  }

  @User(['get1', 'admin'])
  @UseFilters(MyFilter3)
  @Get('/2')
  get2() {
    throw new BadGatewayException();
  }

  // ParseIntPipe 内置管道, 把类型转number
  @User(['get1', 'user'])
  @Get('/pipe/:id')
  pipe1(@Param('id', ParseIntPipe) id: number) {
    return {
      id: id,
    };
  }

  @UseGuards(MethodGuard)
  @Get('/pipe/gen/id')
  pipe2(@Query('id', GenUserIdPipe) id: string) {
    return {
      id: id,
    };
  }
}
