import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { ProjectDao } from './dto/project.dao';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: '获取项目列表', description: '获取所有项目，支持分页和筛选' })
  @ApiQuery({ name: 'name', required: false, description: '项目名称', type: String })
  @ApiResponse({ status: 200, description: '获取项目列表成功', type: [ProjectDao] })
  async findAll(@Query() query: any) {
    const result = await this.projectsService.findAll(query);
    return {
      data: result,
      code: 200,
      message: 'success'
    };
  }

  @Get(':name')
  @ApiOperation({ summary: '获取版本列表', description: '根据项目名称获取版本列表' })
  @ApiParam({ name: 'name', description: '项目名称', type: String })
  @ApiResponse({ status: 200, description: '获取版本列表成功', type: [ProjectDao] })
  @ApiResponse({ status: 404, description: '项目不存在' })
  async findVersions(@Param('name') name: string) {
    const result = await this.projectsService.findVersions(name);
    return {
      data: result,
      code: 200,
      message: 'success'
    };
  }

  @Get(':name/:version/:type/file')
  @ApiOperation({ summary: '获取项目详情', description: '根据项目名称和版本获取项目详情' })
  @ApiParam({ name: 'name', description: '项目名称', type: String })
  @ApiParam({ name: 'version', description: '项目版本', type: String })
  @ApiParam({ name: 'type', description: '项目类型', type: String })
  @ApiQuery({name: 'path', description: '文件路径', type: String })
  @ApiResponse({ status: 200, description: '获取项目详情成功', type: ProjectDao })
  @ApiResponse({ status: 404, description: '项目不存在' })
  async findFile(@Param('name') name: string, @Param('version') version: string, @Param('type') type: string, @Query('path') path: string) {
    const result = await this.projectsService.findFile(name, version, type, path);
    return {
      data: result,
      code: 200,
      message: 'success'
    };
  }

  @Get(':name/:version/:type')
  @ApiOperation({ summary: '获取项目详情', description: '根据项目名称和版本获取项目详情' })
  @ApiParam({ name: 'name', description: '项目名称', type: String })
  @ApiParam({ name: 'version', description: '项目版本', type: String })
  @ApiParam({ name: 'type', description: '项目类型', type: String })
  @ApiResponse({ status: 200, description: '获取项目详情成功', type: ProjectDao })
  @ApiResponse({ status: 404, description: '项目不存在' })
  async findProject(@Param('name') name: string, @Param('version') version: string, @Param('type') type: string) {
    const result = await this.projectsService.findOne(name, version, type);
    return {
      data: result,
      code: 200,
      message: 'success'
    };
  }
} 