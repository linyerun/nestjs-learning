import {
  Controller,
  Get,
  BadRequestException,
  BadGatewayException,
  UseFilters,
} from '@nestjs/common';
import { MyFilter2 } from '@/expfilters/filter2.js';
import { MyFilter3 } from '@/expfilters/filter3.js';

@UseFilters(MyFilter2)
@Controller('user')
export class UserController {
  @Get('/1')
  get1() {
    throw new BadRequestException();
  }

  @UseFilters(MyFilter3)
  @Get('/2')
  get2() {
    throw new BadGatewayException();
  }
}
