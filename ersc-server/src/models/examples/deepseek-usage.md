# DeepSeek 模型使用指南

## 配置说明

DeepSeek 提供了与 OpenAI 完全兼容的 API 接口，我们使用 OpenAI SDK 来调用 DeepSeek 的服务。

### 环境变量配置

在 `.env` 文件中添加以下配置：

```bash
# DeepSeek 配置
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
DEEPSEEK_MAX_TOKENS=2048
DEEPSEEK_TEMPERATURE=0.7
```

### 获取 API 密钥

1. 访问 [DeepSeek 官网](https://platform.deepseek.com/)
2. 注册账号并登录
3. 在控制台中创建 API 密钥
4. 将密钥添加到环境变量中

## 支持的模型

DeepSeek 当前支持的主要模型：

- `deepseek-chat` - 主要的对话模型
- `deepseek-coder` - 专门用于代码生成的模型

## 使用示例

### 1. 普通聊天

```bash
curl -X POST http://localhost:3000/api/v1/models/chat?provider=deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "system",
        "content": "你是一个有用的AI助手。"
      },
      {
        "role": "user",
        "content": "请介绍一下 DeepSeek 模型的特点。"
      }
    ],
    "model": "deepseek-chat",
    "temperature": 0.7,
    "maxTokens": 1000
  }'
```

### 2. 流式聊天

```bash
curl -X POST http://localhost:3000/api/v1/models/chat/stream?provider=deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "写一个 Python 快速排序算法"
      }
    ],
    "model": "deepseek-coder"
  }'
```

### 3. JavaScript 调用示例

```javascript
// 普通聊天
async function chatWithDeepSeek() {
  const response = await fetch('/api/v1/models/chat?provider=deepseek', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: '你好，请用中文回答我的问题。' }
      ],
      model: 'deepseek-chat',
      temperature: 0.7
    })
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
}

// 流式聊天
async function streamChatWithDeepSeek() {
  const response = await fetch('/api/v1/models/chat/stream?provider=deepseek', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: '请详细解释什么是机器学习' }
      ],
      model: 'deepseek-chat'
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
}
```

## 特殊功能

### 代码生成

DeepSeek 在代码生成方面表现优异，特别是 `deepseek-coder` 模型：

```bash
curl -X POST http://localhost:3000/api/v1/models/chat?provider=deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "system",
        "content": "你是一个专业的编程助手，专注于生成高质量的代码。"
      },
      {
        "role": "user",
        "content": "用 TypeScript 写一个二叉树的遍历算法，包括前序、中序、后序遍历。"
      }
    ],
    "model": "deepseek-coder",
    "temperature": 0.1
  }'
```

### 数学推理

DeepSeek 在数学推理方面也很强大：

```bash
curl -X POST http://localhost:3000/api/v1/models/chat?provider=deepseek \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "请解这个数学问题：一个圆的半径是 5，求圆的面积和周长，并详细说明计算过程。"
      }
    ],
    "model": "deepseek-chat"
  }'
```

## 性能特点

- **成本效益高**: DeepSeek 提供了极具竞争力的定价
- **响应速度快**: 中国大陆访问速度优异
- **支持长文本**: 支持较长的上下文窗口
- **中文能力强**: 对中文的理解和生成能力优秀

## 注意事项

1. **API 限制**: 注意 DeepSeek 的 API 调用频率限制
2. **模型选择**: 根据任务类型选择合适的模型（chat vs coder）
3. **温度设置**: 代码生成任务建议使用较低的 temperature (0.1-0.3)
4. **错误处理**: 网络问题时会自动故障转移到其他配置的模型

## 故障排除

### 常见问题

1. **401 Unauthorized**: 检查 API 密钥是否正确
2. **429 Too Many Requests**: 请求频率过高，需要降低请求频率
3. **网络超时**: 检查网络连接或尝试使用故障转移模式

### 调试方法

启动服务时查看日志，确认 DeepSeek 提供者是否正确初始化：

```bash
npm run start:dev
```

查看输出中是否包含：
```
[ModelRouterService] Initialized provider: deepseek
``` 