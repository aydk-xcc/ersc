import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProjectsService {
  private readonly BASE_DIR = process.env.BASE_DIR || '.ersc/projects';

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {
    // 确保基础目录存在
    this.ensureBaseDir();
  }

  private ensureBaseDir(): void {
    if (!fs.existsSync(this.BASE_DIR)) {
      fs.mkdirSync(this.BASE_DIR, { recursive: true });
    }
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return this.projectRepository.save(project);
  }

  async findAll(query: any): Promise<{ data: Project[]; total: number }> {
    const { pageSize = 10, pageNum = 1, name, user_id, ...rest } = query;
    
    const where: any = { ...rest };
    
    if (name) {
      where.name = Like(`%${name}%`);
    }
    
    if (user_id) {
      where.user_id = user_id;
    }
    
    const [data, total] = await this.projectRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { updatedAt: 'DESC' },
    });
    
    return { data, total };
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
    });
    
    if (!project) {
      throw new NotFoundException(`项目 #${id} 未找到`);
    }
    
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    
    Object.assign(project, {
      ...updateProjectDto,
      updatedAt: Date.now(),
    });
    
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    
    // 删除关联的项目目录
    if (project.base_dir) {
      const dirPath = path.join(this.BASE_DIR, project.base_dir);
      if (fs.existsSync(dirPath)) {
        fs.rmdirSync(dirPath, { recursive: true });
      }
    }
    
    await this.projectRepository.remove(project);
  }
} 