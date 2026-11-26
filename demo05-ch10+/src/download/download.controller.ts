import { Controller, Get, Param, Res } from '@nestjs/common';
import { DownloadService } from './download.service.js';
import type { Response } from 'express';
import { join } from 'path';
import fs from 'node:fs';
import { zip } from 'compressing';

@Controller('api/download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get(':filename')
  download(@Param('filename') filename: string, @Res() resp: Response) {
    const path = join(import.meta.dirname, '../../resources', filename);
    if (fs.existsSync(path)) {
      resp.download(path);
      return;
    }
    return resp.status(404).send({ message: 'Not Found' });
  }

  @Get(':filename/stream')
  stream(@Param('filename') filename: string, @Res() resp: Response) {
    const path = join(import.meta.dirname, '../../resources', filename);
    if (!fs.existsSync(path)) {
      return resp.status(404).send({ message: 'Not Found' });
    }
    resp.setHeader('Content-Type', 'application/octet-stream');
    resp.setHeader('Content-Disposition', 'attachment; filename="' + filename);
    const tarStream = new zip.Stream();
    tarStream.addEntry(path);
    tarStream.pipe(resp);
  }
}
