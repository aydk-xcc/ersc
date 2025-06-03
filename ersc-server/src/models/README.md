# 多模型转发服务

这个模块提供了统一的AI模型转发能力，支持多个AI服务提供商的模型，包括 OpenAI、Claude (Anthropic)、Gemini (Google)、DeepSeek 等。

## 功能特性

- **多模型支持**: 支持 OpenAI、Claude、Gemini、DeepSeek 等主流AI模型
- **统一接口**: 提供统一的聊天API接口，屏蔽不同提供商的差异
- **智能路由**: 支持多种路由策略（轮询、随机、权重、故障转移）
- **流式响应**: 支持流式和非流式两种响应模式
- **故障转移**: 自动切换到可用的模型提供者
- **负载均衡**: 通过权重配置实现负载均衡

## 依赖要求

本模块需要以下依赖：

```bash
npm install openai  # 用于 OpenAI 和 DeepSeek (OpenAI 兼容) 模型调用
```

## 环境配置

在 `.env` 文件中配置模型提供者的API密钥和相关参数：

```bash
# OpenAI 配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=2048
OPENAI_TEMPERATURE=0.7

# Claude (Anthropic) 配置
CLAUDE_API_KEY=your_claude_api_key_here
CLAUDE_BASE_URL=https://api.anthropic.com
CLAUDE_MODEL=claude-3-sonnet-20240229
CLAUDE_MAX_TOKENS=2048
CLAUDE_TEMPERATURE=0.7

# Gemini (Google) 配置
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_BASE_URL=https://generativelanguage.googleapis.com
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=2048
GEMINI_TEMPERATURE=0.7

# DeepSeek 配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_MAX_TOKENS=2048
DEEPSEEK_TEMPERATURE=0.7
```

## API 接口

### 1. 聊天对话

**POST** `/api/v1/models/chat`

发送消息到AI模型并获取回复。

**请求体:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "你是一个有用的AI助手。"
    },
    {
      "role": "user", 
      "content": "你好！"
    }
  ],
  "model": "gpt-3.5-turbo", // 可选，指定具体模型
  "temperature": 0.7,       // 可选，控制回复的随机性
  "maxTokens": 2048        // 可选，最大输出token数
}
```

**查询参数:**
- `provider` (可选): 指定模型提供者 (`openai`, `claude`, `gemini`, `deepseek`)

### 2. 流式聊天对话

**POST** `/api/v1/models/chat/stream`

发送消息到AI模型并获取流式回复。

请求体格式与普通聊天接口相同，响应为 Server-Sent Events (SSE) 格式。

### 3. 获取可用提供者

**GET** `/api/v1/models/providers`

返回当前配置的所有模型提供者列表。

### 4. 获取路由状态

**GET** `/api/v1/models/status`

返回当前模型路由的详细状态信息。

### 5. 设置路由策略

**PUT** `/api/v1/models/routing-strategy`

更新模型选择的路由策略。

**请求体:**
```json
{
  "type": "round-robin",  // 路由策略类型
  "weights": {            // 权重配置（仅 priority 策略使用）
    "openai": 2,
    "claude": 1,
    "gemini": 1,
    "deepseek": 1
  }
}
```

## 路由策略

### 1. 轮询 (round-robin)
按顺序轮流使用不同的模型提供者。

### 2. 随机 (random)
随机选择一个可用的模型提供者。

### 3. 优先级 (priority)
根据权重配置选择模型提供者，权重越高被选中的概率越大。

### 4. 故障转移 (failover)
优先使用第一个提供者，失败时自动切换到下一个。

## 使用示例

### JavaScript/TypeScript

```javascript
// 普通聊天
const response = await fetch('/api/v1/models/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: '你好，请介绍一下你自己。' }
    ]
  })
});

const data = await response.json();
console.log(data.choices[0].message.content);

// 流式聊天
const response = await fetch('/api/v1/models/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: '写一首关于春天的诗。' }
    ]
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6);
      if (data === '[DONE]') return;
      
      try {
        const parsed = JSON.parse(data);
        if (parsed.content) {
          console.log(parsed.content);
        }
      } catch (e) {
        // 忽略解析错误
      }
    }
  }
}
```

### cURL

```bash
# 普通聊天
curl -X POST http://localhost:3000/api/v1/models/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "你好！"}
    ]
  }'

# 指定提供者
curl -X POST "http://localhost:3000/api/v1/models/chat?provider=claude" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "你好！"}
    ]
  }'

# 流式聊天
curl -X POST http://localhost:3000/api/v1/models/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "写一首诗"}
    ]
  }'

# 指定提供者
curl -X POST "http://localhost:3000/api/v1/models/chat?provider=deepseek" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "你好！"}
    ]
  }'
```

## 扩展新的模型提供者

要添加新的模型提供者，需要：

1. 在 `providers/` 目录下创建新的提供者类，实现 `ModelProvider` 接口
2. 在 `ModelRouterService` 的 `initializeProviders()` 方法中添加新提供者的初始化逻辑
3. 在环境配置中添加对应的配置项

### 示例：添加自定义 OpenAI 兼容接口

```typescript
// providers/custom-openai.provider.ts
import { Injectable } from '@nestjs/common';
import { OpenAIProvider } from './openai.provider';

@Injectable()
export class CustomOpenAIProvider extends OpenAIProvider {
  name = 'CustomOpenAI';
  
  // 可以重写特定方法以适配自定义接口
}
```

## 注意事项

1. 确保配置了至少一个有效的API密钥，否则服务将无法正常工作
2. 不同模型提供者的API限制和计费方式不同，请注意使用成本
3. 流式请求可能会占用更多服务器资源，建议根据实际需求调整并发限制
4. 故障转移策略在流式请求中的支持有限，建议使用其他策略 