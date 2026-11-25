import { Inject } from '@nestjs/common';

export class LyrService {
  constructor(
    @Inject('shoppingWebsites') private readonly shoppingWebsites: string[],
  ) {}

  get() {
    return {
      shoppingWebsites: this.shoppingWebsites,
    };
  }
}
