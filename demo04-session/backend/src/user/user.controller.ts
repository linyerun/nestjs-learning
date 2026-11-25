import { Controller, Get, Post, Req, Res, Body } from '@nestjs/common';
import { UserService } from './user.service.js';
import type { Request, Response } from 'express';
import svgCaptcha from 'svg-captcha';
import { CreateUserDto } from './dto/create-user.dto.js';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('code')
  createCaptcha(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    req.session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('create')
  createUser(@Req() req: Request, @Body() body: CreateUserDto) {
    if (!req.session.code) {
      return {
        message: '请先获取验证码图片',
      };
    }
    if (
      req.session.code.toLocaleLowerCase() === body.code.toLocaleLowerCase()
    ) {
      req.session.code = ''; // 清楚之前的code
      return {
        message: '成功创建用户',
      };
    }
    return {
      message: '验证码错误',
    };
  }
}
