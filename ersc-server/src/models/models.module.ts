import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModelsController } from './models.controller';
import { ModelsService } from './models.service';
import { DeepSeekProvider } from './providers/deepseek.provider';

@Module({
  imports: [ConfigModule],
  controllers: [ModelsController],
  providers: [ModelsService, DeepSeekProvider],
  exports: [ModelsService],
})
export class ModelsModule {} 