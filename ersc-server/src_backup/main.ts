import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
  
  // 启动应用
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap(); 