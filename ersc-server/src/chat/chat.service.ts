import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './entities/chat.entity';
import { CreateChatDto, MessageRole } from './dto/create-chat.dto';
import { DeepSeekProvider } from './providers/deepseek.provider';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    private readonly deepSeekProvider: DeepSeekProvider
  ) {}

  // 发送用户消息并生成AI响应
  async sendMessage(createChatDto: CreateChatDto): Promise<{
    message: string;
  }> {
    // 创建用户消息
    await this.create({
      ...createChatDto,
      role: MessageRole.USER,
    });

    try {
      // 生成AI响应内容
      const aiResponseContent = await this.deepSeekProvider.chat([
        {
          role: MessageRole.USER,
          content: createChatDto.content,
        },
      ]);
      // 创建AI响应消息
      await this.create({
        chatSessionId: createChatDto.chatSessionId,
        role: MessageRole.ASSISTANT,
        content: aiResponseContent.choices[0].message.content,
        userId: createChatDto.userId,
        modelName: createChatDto.modelName || 'DeepSeek-Chat',
        modelConfig: createChatDto.modelConfig,
        metadata: {
          modelName: createChatDto.modelName || 'DeepSeek-Chat',
          timestamp: Date.now(),
        },
      });

      return {
        message: aiResponseContent.choices[0].message.content,
      };
    } catch (error) {
      console.error('AI响应生成失败:', error);
      throw error;
    }
  }

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const chat = this.chatRepository.create(createChatDto);
    return await this.chatRepository.save(chat);
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['chatSession'],
    });
    
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    
    return chat;
  }

  async remove(id: number): Promise<void> {
    const chat = await this.findOne(id);
    await this.chatRepository.remove(chat);
  }

  private async generateAIResponse(
    userMessage: string,
    chatSessionId: number,
    modelName?: string
  ): Promise<string> {
    // TODO: 实现真实的大模型调用逻辑
    // 可以获取历史消息作为上下文：
    // const history = await this.findByChatSessionId(chatSessionId);
    
    // 模拟AI响应
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return `这是AI对"${userMessage}"的模拟响应。使用模型: ${modelName || '默认模型'}`;
  }
} 