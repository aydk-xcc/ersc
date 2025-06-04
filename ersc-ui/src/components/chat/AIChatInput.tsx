import { Input, Dropdown, Tag, Space, Button } from "antd";
import { ArrowUpOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { MenuProps } from 'antd';
import './css/AIChatInput.scss';
import PlIcon from "../icon/PlIcon";
import { sendChatMessage } from "@/api/messageApi";

interface MentionItem {
    path: string;
    name: string;
    origin: string;
    type?: string;
}

export default function AIChatInput({ onSubmit, sessionId }: { onSubmit: (message: ModelMessage) => void, sessionId: number }) {
    const [inputValue, setInputValue] = useState('');
    const [selectedModel, setSelectedModel] = useState('DeepSeek-Chat');
    const [mentions, setMentions] = useState<MentionItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 模型选项
    const modelList: MenuProps['items'] = [
        { key: 'deepseek', label: 'DeepSeek-Chat', icon: <PlIcon type="vs-deepseek" /> },
        { key: 'openai', label: 'OpenAI', disabled: true, icon: <PlIcon type="vs-openai" /> },
        { key: 'kimi', label: 'Kimi', disabled: true, icon: <PlIcon type="vs-kimi" /> },
    ];

    const removeMention = (index: number) => {
        setMentions(mentions.filter((_, i) => i !== index));
    };

    const getMentionColor = (type?: string) => {
        switch (type) {
            case 'file': return 'blue';
            case 'function': return 'green';
            case 'variable': return 'orange';
            default: return 'default';
        }
    };

    const handleMentionClick = (mention: MentionItem) => {
        console.log('点击提及项:', mention);
        // 这里可以添加点击提及项的逻辑，比如跳转到文件等
    };

    const handleSubmit = async () => {
        onSubmit({
            role: 'user',
            content: inputValue
        });
        setIsLoading(true);
        setInputValue('');
        sendChatMessage({
            content: inputValue,
            chatSessionId: sessionId,
            userId: 1
        }).then((res: any) => {
            onSubmit({
                role: 'assistant',
                content: res.message
            });
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="ai-chat-input">
            <div className="ai-chat-input-thinking" style={{ display: isLoading ? 'block' : 'none' }}>
                思考中<span className="loading-dots"></span>
            </div>
            <div className="ai-chat-mention">
                {mentions.map((mention, index) => (
                    <Tag 
                        key={index} 
                        color={getMentionColor(mention.type)} 
                        onClose={() => removeMention(index)}
                        onClick={() => handleMentionClick(mention)}
                    >
                        {mention.name}
                    </Tag>
                ))}
            </div>
            <Input.TextArea
                value={inputValue}
                className="ai-chat-input-textarea"
                placeholder="请输入问题"
                autoSize={{ minRows: 2, maxRows: 6 }}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="ai-chat-input-footer">
                <div>
                <Dropdown menu={{ items: modelList }}>
                    <span
                        className="ai-chat-input-model"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Space>
                            {selectedModel}
                            <DownOutlined />
                        </Space>
                    </span>
                </Dropdown>
                </div>
                <div>
                    <Button
                        loading={isLoading}
                        type="primary"
                        shape="circle" 
                        icon={<ArrowUpOutlined />} 
                        disabled={!inputValue || isLoading} 
                        onClick={handleSubmit} 
                        className="ai-chat-input-submit"
                    />
                </div>
            </div>
        </div>
    )
}