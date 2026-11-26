import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

export class GenUserIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('[GenUserIdPipe]', value);
    return value || randomUUID(); // 用户上传零值我就生成uuid
  }
}
