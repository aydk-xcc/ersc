import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession } from './entities/chat-session.entity';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';

@Injectable()
export class ChatSessionService {
  constructor(
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
  ) {}

  async create(createChatSessionDto: CreateChatSessionDto): Promise<ChatSession> {
    const chatSession = this.chatSessionRepository.create(createChatSessionDto);
    return await this.chatSessionRepository.save(chatSession);
  }

  async findBySessionId(id: number): Promise<ChatSession> {
    const chatSession = await this.chatSessionRepository.findOne({
      where: { id: id },
      relations: ['chats'],
    });
    
    if (!chatSession) {
      throw new NotFoundException(`ChatSession with id ${id} not found`);
    }
    
    return chatSession;
  }

  async findByUserId(userId: number): Promise<ChatSession[]> {
    return await this.chatSessionRepository.find({
      where: { userId },
      relations: ['chats'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateBySessionId(id: number, updateChatSessionDto: UpdateChatSessionDto): Promise<ChatSession> {
    const chatSession = await this.findBySessionId(id);
    await this.chatSessionRepository.update(chatSession.id, updateChatSessionDto);
    return this.findBySessionId(id);
  }

  async removeBySessionId(id: number): Promise<{ success: boolean }> {
    const chatSession = await this.findBySessionId(id);
    await this.chatSessionRepository.remove(chatSession);
    return {
      success: true,
    };
  }

  // 清空会话的所有消息
  async clearMessagesBySessionId(id: number): Promise<void> {
    const chatSession = await this.findBySessionId(id);
    // 删除所有关联的chat消息
    await this.chatSessionRepository
      .createQueryBuilder()
      .relation(ChatSession, 'chats')
      .of(chatSession)
      .remove(chatSession.chats);
  }
} 