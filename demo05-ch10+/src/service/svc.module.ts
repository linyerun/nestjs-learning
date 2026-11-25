import { Module } from '@nestjs/common';
import { LyrService } from './lyr.js';

@Module({
  providers: [
    {
      provide: 'lyrSvc',
      useClass: LyrService,
    },
    {
      provide: 'shoppingWebsites',
      useValue: ['TB', 'PDD', 'JD'],
    },
  ],
  exports: ['lyrSvc'],
})
export class SvcModule {}
