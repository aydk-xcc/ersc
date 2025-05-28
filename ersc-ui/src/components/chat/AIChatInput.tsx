import { Input, Dropdown, Tag, Space } from "antd";
import { ArrowUpOutlined, DownOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import type { MenuProps } from 'antd';
import './AIChatInput.scss';

interface MentionItem {
    path: string;
    name: string;
    origin: any;
    type?: string;
}

export default function AIChatInput() {
    const [inputValue, setInputValue] = useState('');
    const [selectedModel, setSelectedModel] = useState('claude-4-sonnet');
    const [mentions, setMentions] = useState<MentionItem[]>([]);

    // 模型选项
    const modelList: MenuProps['items'] = [
        { key: 'claude-4-sonnet', label: 'Claude 4 Sonnet', icon: '🤖' },
        { key: 'gpt-4', label: 'GPT-4', icon: '🧠' },
        { key: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', icon: '⚡' },
        { key: 'gemini-pro', label: 'Gemini Pro', icon: '💎' },
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

    return (
        <div className="ai-chat-input">
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
                    <ArrowUpOutlined
                        className="ai-chat-input-submit"
                    />
                </div>
            </div>
        </div>
    )
}