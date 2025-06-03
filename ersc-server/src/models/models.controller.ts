import {
  Controller,
  Post,
  Body,
  Header,
  Res,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { ModelsService } from './models.service';
import { IsString, IsArray, IsBoolean, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { Response } from 'express';

class ChatMessageDto {
  @IsString()
  role: 'system' | 'user' | 'assistant';

  @IsString()
  content: string;
}
class ChatRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  messages: ChatMessageDto[];
  
  @IsString()
  @IsOptional()
  model?: string;

  @IsNumber()
  @IsOptional()
  temperature?: number;

  @IsNumber()
  @IsOptional()
  maxTokens?: number;

  @IsBoolean()
  @IsOptional()
  stream?: boolean;
}

class RoutingStrategyDto {
  type: 'round-robin' | 'random' | 'priority' | 'failover';
  weights?: Record<string, number>;
}

@ApiTags('models')
@Controller('models')
export class ModelsController {
  constructor(private readonly modelServer: ModelsService) {}

  @Post('chat')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: '聊天对话', description: '发送消息到AI模型并获取回复' })
  @ApiBody({ type: Array<ChatMessage> })
  @ApiQuery({ name: 'provider', required: false, description: '指定模型提供者 (openai, claude, gemini, deepseek)' })
  async chat(
    @Body() body: Array<ChatMessage>,
    @Query('provider') provider?: string,
  ): Promise<any> {
    console.log(body);
    return this.modelServer.chat(body, provider='deepseek');
  }

  @Post('chat/stream')
  @ApiOperation({ summary: '流式聊天对话', description: '发送消息到AI模型并获取流式回复' })
  @ApiBody({ type: ChatRequestDto })
  @ApiQuery({ name: 'provider', required: false, description: '指定模型提供者 (openai, claude, gemini, deepseek)' })
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async streamChat(
    @Body() request: ChatRequestDto,
    @Res() res: Response,
    @Query('provider') provider?: string,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    try {
      for await (const chunk of this.modelServer.streamChat(request)) {
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    } finally {
      res.end();
    }
  }
} 