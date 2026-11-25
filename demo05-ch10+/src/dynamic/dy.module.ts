import { DynamicModule, Global, Module } from '@nestjs/common';

@Global()
export class DyModule {
  static dynamicModule(
    options?: Partial<{ path: string; name: string }>,
  ): DynamicModule {
    return {
      module: DyModule,
      providers: [
        {
          provide: 'val',
          useValue: { val: 'haha', path: options?.path, name: options?.name },
        },
      ],
      exports: ['val'],
    };
  }
}
