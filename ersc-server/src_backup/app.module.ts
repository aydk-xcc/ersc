import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { FilesModule } from './files/files.module';
import { join } from 'path';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // 数据库模块
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join('.ersc', 'ersc_db.db'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    
    // 业务模块
    ProjectsModule,
    FilesModule,
  ],
})
export class AppModule {
  constructor() {
    // 初始化操作
  }
} 