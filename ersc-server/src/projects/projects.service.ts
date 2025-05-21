import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectDao } from './dto/project.dao';
import * as fs from 'fs';
import * as path from 'path';
import { getAllFiles } from '../utils/file.utils';

@Injectable()
export class ProjectsService {
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

  async findAll(query: any): Promise<ProjectDao[]> {
    const dirPath = this.BASE_DIR;
    console.log(dirPath);
    const projects = fs.readdirSync(dirPath);
    console.log(projects);
    const list = projects.map(project => ({
      name: project
    }));
    
    return list;
  }

  async findVersions(name: string): Promise<ProjectDao[]> {
    const dirPath = path.join(this.BASE_DIR, name);
    if (!fs.existsSync(dirPath)) {
      throw new NotFoundException(`项目 #${name} 未找到`);
    }
    
    const versions = fs.readdirSync(dirPath);
    const list = versions.map(version => {
        const types = fs.readdirSync(dirPath + '/' + version);
        return {
            version,
            types
        }
    });
    return list;
  }

  async findOne(name: string, version: string, type: string = 'base'): Promise<string[]> {
    const dirPath = path.join(this.BASE_DIR, name, version, type);
    if (!fs.existsSync(dirPath)) {
      throw new NotFoundException(`项目 #${name} 版本 #${version} 未找到`);
    }
    
    const files = getAllFiles(dirPath, dirPath);
    return files;
  }

  async findFile(name: string, version: string, type: string = 'base', filePath: string): Promise<string> {
    const dirPath = path.join(this.BASE_DIR, name, version, type, filePath);
    if (!fs.existsSync(dirPath)) {
      throw new NotFoundException(`项目 #${name} 版本 #${version} 未找到`);
    }
    
    const fileInfo = fs.readFileSync(dirPath, 'utf-8');
    return fileInfo;
  }
} 