import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { ModelsModule } from './models/models.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ChatSessionModule } from './chat-session/chat-session.module';
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
    ModelsModule,
    UsersModule,
    ChatModule,
    ChatSessionModule,
  ],
})
export class AppModule {
  constructor() {
    // 初始化操作
  }
} 