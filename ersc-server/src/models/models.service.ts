import { Injectable } from '@nestjs/common';
import { DeepSeekProvider } from './providers/deepseek.provider';

@Injectable()
export class ModelsService {
  constructor(private readonly deepSeekProvider: DeepSeekProvider) {}

  async chat(messages: Array<ChatMessage>, provider: string): Promise<any> {
    if (provider === 'deepseek') {
      return this.deepSeekProvider.chat(messages);
    }
    throw new Error(`Unsupported provider: ${provider}`);
  }

  async *streamChat(request: any): AsyncIterable<string> {
    yield* this.deepSeekProvider.streamChat(request);
  }
}