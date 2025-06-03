import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatSessionService } from './chat-session.service';
import { ChatSessionController } from './chat-session.controller';
import { ChatSession } from './entities/chat-session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChatSession])],
  controllers: [ChatSessionController],
  providers: [ChatSessionService],
  exports: [ChatSessionService],
})
export class ChatSessionModule {} 