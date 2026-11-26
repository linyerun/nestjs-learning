import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UploadService } from './upload.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    /*
    {
      fieldname: 'file',
      originalname: 'OpenIM消息发送全链路流转图.html',
      encoding: '7bit',
      mimetype: 'text/html',
      path: '/Users/linyerun/Code/frontedcode/nestjs-learning/demo05-ch10+/resources/1795628945830.html',
      destination: '/Users/linyerun/Code/frontedcode/nestjs-learning/demo05-ch10+/resources',
      filename: '1795628945830.html',
      size: 9138
    }
    */
    console.log(file);
    return {
      message: '上传成功',
      path: `/resources/${file.filename}`,
    };
  }
}
