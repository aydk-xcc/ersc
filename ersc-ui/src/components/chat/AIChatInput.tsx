import { Input, Dropdown, Tag, Space, Button } from "antd";
import { ArrowUpOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { MenuProps } from 'antd';
import './css/AIChatInput.scss';
import PlIcon from "../icon/PlIcon";
import { chatMessage } from "@/api/modelApi";

interface MentionItem {
    path: string;
    name: string;
    origin: string;
    type?: string;
}

export default function AIChatInput({ onSubmit }: { onSubmit: (message: ModelMessage) => void }) {
    const [inputValue, setInputValue] = useState('');
    const [selectedModel, setSelectedModel] = useState('DeepSeek-Chat');
    const [mentions, setMentions] = useState<MentionItem[]>([]);

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
        console.log('提交');
        onSubmit({
            role: 'assistant',
            content: inputValue
        });
        const messages = [
            {
                role: 'system',
                content: '你是一个代码阅读器，请根据用户的问题，阅读代码，并给出回答。'
            },
            {
                role: 'user',
                content: inputValue
            }
        ];
        const res = await chatMessage(messages, selectedModel);

        console.log(res);
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
                        type="primary"
                        shape="circle" 
                        icon={<ArrowUpOutlined />} 
                        disabled={!inputValue} 
                        onClick={handleSubmit} 
                        className="ai-chat-input-submit"
                    />
                </div>
            </div>
        </div>
    )
}