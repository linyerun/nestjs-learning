import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from "../core/decorators";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  // @Inject 显式声明依赖：tsx 下读不到 design:paramtypes，靠它注入；
  // 用 tsc 编译时即使不写也能工作
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get()
  findAll(@Query("keyword") keyword?: string) {
    return this.userService.findAll(keyword);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(Number(id));
  }

  @Post()
  create(@Body() body: { name: string }) {
    return this.userService.create(body.name);
  }
}