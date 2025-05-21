import { Controller, Post, Req } from '@nestjs/common';
import { FilesService } from './files.service';
import { Request } from 'express';

@Controller('file')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  async uploadFile(@Req() req: Request) {
    try {
      const files = await this.filesService.uploadFile(req);
      return {
        data: files,
        code: 200,
        message: 'success'
      };
    } catch (error) {
      return {
        data: null,
        code: 500,
        message: error.message || '上传失败'
      };
    }
  }
} 