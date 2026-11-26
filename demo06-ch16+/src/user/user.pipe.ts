import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

// 全局管道, 全部控制器的全部方法的全部参数的装饰器获取值后要经过它
export class GlobalPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    console.log('[GlobalPipe]', value);
    return value;
  }
}

// 控制器管道, 修饰的控制器的全部方法的全部参数的装饰器获取值后要经过它
export class CtlPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    console.log('[CtlPipe]', value);
    return value;
  }
}

// 方法管道，修饰的方法的全部参数的装饰器获取值后要经过它
export class MethodPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    console.log('[MethodPipe]', value);
    return value;
  }
}

// 参数管道，修饰的参数的装饰器获取值后要经过它
export class GenUserIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    console.log('[GenUserIdPipe]', value);
    return value || randomUUID(); // 用户上传零值我就生成uuid
  }
}
