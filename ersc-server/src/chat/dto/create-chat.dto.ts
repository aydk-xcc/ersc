import { IsString, IsOptional, IsNumber, IsObject, IsEnum } from 'class-validator';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export class CreateChatDto {
  @IsNumber()
  chatSessionId: number;

  @IsOptional()
  @IsEnum(MessageRole)
  role?: MessageRole;

  @IsString()
  content: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  modelName?: string;

  @IsOptional()
  @IsObject()
  modelConfig?: any;

  @IsOptional()
  @IsObject()
  metadata?: any;
} 