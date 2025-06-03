import { IsString, IsOptional } from 'class-validator';

export class UpdateChatSessionDto {
  @IsOptional()
  @IsString()
  title?: string;
} 