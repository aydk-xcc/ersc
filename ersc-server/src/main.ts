import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  // 加载环境变量
  dotenv.config();
  
  // 创建NestJS应用
  const app = await NestFactory.create(AppModule);
  
  // 设置全局前缀
  app.setGlobalPrefix('api/v1');
  
  // 使用全局管道进行数据验证
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 配置Swagger
  const config = new DocumentBuilder()
    .setTitle('ERSC API文档')
    .setDescription('ERSC服务端API接口文档')
    .setVersion('1.0')
    .addTag('projects', '项目管理')
    .addTag('files', '文件管理')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // 启动应用
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api/docs`);
}

bootstrap(); 