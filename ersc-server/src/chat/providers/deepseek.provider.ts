import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class DeepSeekProvider {
  name = 'DeepSeek';
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
    });
  }

  async chat(messages: Array<ChatMessage>): Promise<any> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        stream: false,
      });

      // 转换为统一的 ChatResponse 格式
      return {
        id: completion.id,
        object: completion.object,
        created: completion.created,
        model: completion.model,
        choices: completion.choices.map(choice => ({
          index: choice.index,
          message: {
            role: choice.message.role as 'system' | 'user' | 'assistant',
            content: choice.message.content || '',
          },
          finishReason: choice.finish_reason || 'stop',
        })),
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      throw new Error(`DeepSeek API error: ${error.message}`);
    }
  }

  async *streamChat(request: any): AsyncIterable<string> {
    try {
      const stream = await this.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 2048,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      throw new Error(`DeepSeek streaming error: ${error.message}`);
    }
  }
} 