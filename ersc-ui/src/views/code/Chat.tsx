import React, { useState, useRef, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import logoAvatar from '@/assets/image/logo.png';
import userAvatar from '@/assets/image/avatar.png';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  Avatar
} from '@chatscope/chat-ui-kit-react';
import Typewriter from 'typewriter-effect';
import './chat.scss';

interface ChatMessage {
  id: string;
  message: string;
  sentTime: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
  isTyping?: boolean;
}

interface TypewriterMessageProps {
  text: string;
  onComplete?: () => void;
}

const TypewriterMessage: React.FC<TypewriterMessageProps> = ({ text, onComplete }) => {
  return (
    <div className="typewriter-message">
      <Typewriter
        onInit={(typewriter) => {
          typewriter
            .typeString(text)
            .callFunction(() => {
              onComplete?.();
            })
            .start();
        }}
        options={{
          delay: 30,
          cursor: '',
          deleteSpeed: 'natural'
        }}
      />
    </div>
  );
};

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: '你好！我是AI助手，有什么可以帮助你的吗？',
      sentTime: new Date().toLocaleTimeString(),
      sender: 'AI Assistant',
      direction: 'incoming'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messageListRef = useRef<any>(null);

  // 模拟AI回复
  const simulateAIResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟AI回复内容
    const aiResponses = [
      '这是一个很好的问题！让我来为你详细解答...',
      '根据你的描述，我建议你可以尝试以下几种方法：\n1. 首先检查相关配置\n2. 然后验证数据格式\n3. 最后测试功能是否正常',
      '我理解你的需求。这个问题确实比较复杂，需要从多个角度来分析。',
      '感谢你的提问！基于我的知识库，我可以为你提供以下信息...'
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: randomResponse,
      sentTime: new Date().toLocaleTimeString(),
      sender: 'AI Assistant',
      direction: 'incoming',
      isTyping: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message,
      sentTime: new Date().toLocaleTimeString(),
      sender: 'User',
      direction: 'outgoing'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // 触发AI回复
    await simulateAIResponse(message);
  };

  const handleTypingComplete = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, isTyping: false }
          : msg
      )
    );
  };

  // 自动滚动到底部
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollToBottom();
    }
  }, [messages]);

  return (
    <div className="ai-chat-container">
      <MainContainer>
        <ChatContainer>
          <MessageList ref={messageListRef}>
            {messages.map((message) => (
              <Message
                key={message.id}
                model={{
                  message: message.isTyping ? '' : message.message,
                  sentTime: message.sentTime,
                  sender: message.sender,
                  direction: message.direction
                }}
                avatarSpacer={message.direction === 'outgoing'}
              >
                {message.direction === 'incoming' && (
                  <Avatar
                    src={logoAvatar}
                    name="AI Assistant"
                    size="sm"
                    style={{
                        backgroundColor: '#5A4DF8',
                    }}
                  />
                )}
                {message.isTyping && (
                  <Message.CustomContent>
                    <TypewriterMessage
                      text={message.message}
                      onComplete={() => handleTypingComplete(message.id)}
                    />
                  </Message.CustomContent>
                )}
              </Message>
            ))}
            {isTyping && (
              <TypingIndicator 
                content="AI正在思考中..." 
                avatar="/ai-avatar.png"
              />
            )}
          </MessageList>
          <MessageInput
            placeholder="输入你的问题..."
            value={inputValue}
            onChange={(val) => setInputValue(val)}
            onSend={handleSendMessage}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default AIChat;