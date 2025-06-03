import { IsString, IsNumber } from 'class-validator';

export class CreateChatSessionDto {
  @IsString()
  title: string;

  @IsNumber()
  userId: number;

} 