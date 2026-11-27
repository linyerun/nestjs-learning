import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('keyword', new DefaultValuePipe('')) keyword: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return await this.userService.findAll({ keyword, page, pageSize });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOne(+id);
  }

  // 必须声明在 @Patch(':id') 之前，否则 /user/transfer 会被 :id 抢走匹配（id 变成 "transfer"）
  @Patch('/transfer')
  async transfer(@Body() data: { from: number; to: number; amount: number }) {
    return await this.userService.transfer(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id); //+id,让id强制转成number
  }

  @Post('/:id/tags')
  async addTags(@Body() tags: string[], @Param('id') userId: number) {
    return await this.userService.addTags({ tags, userId });
  }
}
