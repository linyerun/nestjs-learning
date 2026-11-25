import {
  Controller,
  Get,
  Redirect,
  Version,
  Request,
  Response,
} from '@nestjs/common';
import { RoomService } from './room.service.js';
import type { Response as ExpResp, Request as ExpReq } from 'express'; // 底层如果使用的是fastify那就得改了

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  //  @Redirect: 重定向
  @Get()
  @Version('1')
  @Redirect('room/req/2') // 最终的url: @Version('1') + 配置的url
  // @Redirect('/api/v2/room') // 如果我们前缀以/开头, 不受 @Controller('room') + @Version('1')影响
  get1() {
    return { version: 'v1' };
  }

  @Get()
  @Version('2')
  get2() {
    return { version: 'v2' };
  }

  // @Request修饰的参数, 从中能得到一切我想得到的请求数据: query, params, body, headers...
  // 一般我们还是用更细分的 @Query, @Body, @Param, @Headers, @Session来获取更合适
  @Version('1')
  @Get('/req/:id')
  get(@Request() req: ExpReq) {
    console.log();
    // return回去的下面这段内容会被json序列化后返回
    return {
      id: req.params.id,
    };
  }

  // @Next(): 获取将底层的 next 函数注入到控制器方法中。它通常与 Express 风格的中间件逻辑配合使用，用于将控制权传递给下一个处理程序。

  @Get()
  @Version('3')
  // 如果你只是想访问响应对象（例如设置 cookie、自定义响应头），
  // 但仍希望 NestJS 负责序列化返回值和处理状态码，那么必须启用 passthrough 选项。
  get3(@Response({ passthrough: true }) resp: ExpResp) {
    resp.setHeader('LYR', 'MyNameIsLinyerun');
    return {
      name: 'linyerun',
    };
  }
}
