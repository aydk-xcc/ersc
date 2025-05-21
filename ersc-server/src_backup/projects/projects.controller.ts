import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const result = await this.projectsService.create(createProjectDto);
    return {
      data: result,
      code: 200,
      message: 'success'
    };
  }

  @Get()
  async findAll(@Query() query: any) {
    const result = await this.projectsService.findAll(query);
    return {
      data: result.data,
      total: result.total,
      code: 200,
      message: 'success'
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.projectsService.findOne(id);
    return {
      data: result,
      code: 200,
      message: 'success'
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    const result = await this.projectsService.update(id, updateProjectDto);
    return {
      data: result,
      code: 200,
      message: 'success'
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.projectsService.remove(id);
    return {
      data: null,
      code: 200,
      message: 'success'
    };
  }
} 