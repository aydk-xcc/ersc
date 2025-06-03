declare interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

declare interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}