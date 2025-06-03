import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatSessionService } from './chat-session.service';
import { CreateChatSessionDto } from './dto/create-chat-session.dto';
import { UpdateChatSessionDto } from './dto/update-chat-session.dto';

@Controller('chat-session')
export class ChatSessionController {
  constructor(
    private readonly chatSessionService: ChatSessionService,
  ) {}

  @Post()
  create(@Body() createChatSessionDto: CreateChatSessionDto) {
    return this.chatSessionService.create(createChatSessionDto);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.chatSessionService.findByUserId(userId);
  }

  @Get(':id')
  findBySessionId(@Param('id') id: number) {
    return this.chatSessionService.findBySessionId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateChatSessionDto: UpdateChatSessionDto,
  ) {
    return this.chatSessionService.updateBySessionId(id, updateChatSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.chatSessionService.removeBySessionId(id);
  }

  // 清空会话的所有消息
  @Delete(':id/messages')
  clearMessages(@Param('id') id: number) {
    return this.chatSessionService.clearMessagesBySessionId(id);
  }
} 