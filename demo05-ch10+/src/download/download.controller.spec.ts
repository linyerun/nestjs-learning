import { Test, TestingModule } from '@nestjs/testing';
import { DownloadController } from './download.controller.js';
import { DownloadService } from './download.service.js';

describe('DownloadController', () => {
  let controller: DownloadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DownloadController],
      providers: [DownloadService],
    }).compile();

    controller = module.get<DownloadController>(DownloadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
