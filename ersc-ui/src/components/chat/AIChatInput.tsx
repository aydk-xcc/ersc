import { Input, Dropdown, Tag, Space } from "antd";
import { ArrowUpOutlined, DownOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import type { MenuProps } from 'antd';
import './AIChatInput.scss';

interface MentionItem {
    path: string;
    name: string;
    origin: any;
}

export default function AIChatInput() {
    const [inputValue, setInputValue] = useState('');
    const [selectedModel, setSelectedModel] = useState('claude-4-sonnet');
    const [selectedAgent, setSelectedAgent] = useState('default');
    const [mentions, setMentions] = useState<MentionItem[]>([{
        name: 'Header.tsx',
        path: 'src/components/Header.tsx',
        origin: {}
    }]);

    // 模型选项
    const modelList: MenuProps['items'] = [
        { key: 'claude-4-sonnet', label: 'Claude 4 Sonnet', icon: '🤖' },
        { key: 'gpt-4', label: 'GPT-4', icon: '🧠' },
        { key: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', icon: '⚡' },
        { key: 'gemini-pro', label: 'Gemini Pro', icon: '💎' },
    ];

    const removeMention = (mentionId: string) => {
        setMentions(mentions.filter(m => m.id !== mentionId));
    };

    const getMentionColor = (type: string) => {
        switch (type) {
            case 'file': return 'blue';
            case 'function': return 'green';
            case 'variable': return 'orange';
            default: return 'default';
        }
    };

    return (
        <div className="ai-chat-input">
            <div className="ai-chat-mention">
                {mentions.map(mention => (
                    <Tag key={mention.id} color={getMentionColor(mention.type)} closable onClose={() => removeMention(mention.id)}>
                        {mention.name}
                    </Tag>
                ))}
            </div>
            <Input.TextArea
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
                            Hover me
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