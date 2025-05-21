import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as formidable from 'formidable';
import { Request } from 'express';

@Injectable()
export class FilesService {
  private readonly BASE_DIR = process.env.BASE_DIR || '.ersc/projects';

  constructor() {
    // 确保基础目录存在
    this.ensureBaseDir();
  }

  private ensureBaseDir(): void {
    if (!fs.existsSync(this.BASE_DIR)) {
      fs.mkdirSync(this.BASE_DIR, { recursive: true });
    }
  }

  async uploadFile(req: Request): Promise<any> {
    return new Promise((resolve, reject) => {
      const form = formidable({
        multiples: true,
        keepExtensions: true,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          return reject(err);
        }

        try {
          const base_dir = fields.base_dir ? String(fields.base_dir) : '';
          const targetDir = path.join(this.BASE_DIR, base_dir);

          // 确保目标目录存在
          if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
          }

          const fileResults = [];
          // 处理上传的文件
          for (const key in files) {
            const file = Array.isArray(files[key]) ? files[key][0] : files[key];
            const oldPath = file.filepath;
            const relativePath = fields.path ? String(fields.path) : '';
            const fileName = file.originalFilename;
            const destDir = path.join(targetDir, relativePath);
            
            // 确保目标子目录存在
            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true });
            }
            
            const newPath = path.join(destDir, fileName);
            
            // 移动文件
            fs.copyFileSync(oldPath, newPath);
            fs.unlinkSync(oldPath);
            
            fileResults.push({
              fileName,
              path: path.join(relativePath, fileName),
              size: file.size,
            });
          }
          
          resolve(fileResults);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
} 