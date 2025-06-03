import { useEffect, useState } from 'react';
import './css/AIChat.scss';
import AIChatInput from './AIChatInput';
import AIMessageItem from './AIMessageItem';
import UserMessageItem from './UserMessageItem';
import PlIcon from '../icon/PlIcon';
import { HistoryOutlined, PlusOutlined, EllipsisOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input } from 'antd';
import { 
    createChatSession,
    getUserChatSessions,
    getChatSession,
    updateChatSession,
    deleteChatSession,
    clearChatSessionMessages
} from '@/api/sessionApi';
import { useAppDispatch } from '@/stores/hooks';
import { setChatVisible } from '@/stores/chatSlice';
import AIChatHistory from './AIChatHistory';


export default function AIChat() {
    const [title, setTitle] = useState<string>('');
    const [titleEdit, setTitleEdit] = useState<boolean>(false);
    const [chatSessionId, setChatSessionId] = useState<number>(0);
    const dispatch = useAppDispatch();
    const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);


    const [messages, setMessages] = useState<Array<ModelMessage>>([{
        role: 'assistant',
        content: 'Hello, how can I help you today?'
    },{
        role: 'user',
        content: 'You are a helpful assistant.'
    }]);

    useEffect(() => {
        getUserChatSessions('1').then((res: any) => {
            console.log(res);
            if ((res || []).length === 0) {
                console.log('createChatSession');
                createChatSession({
                    title: 'New Chat',
                    userId: 1
                }).then((res: any) => {
                    initChatInfo(res.id);
                });
            } else {
                initChatInfo(res[res.length - 1].id);
            }
        });
    }, []);

    function initChatInfo(id: number) {
        getChatSession(id).then((res: any) => {
            // setMessages(res.chats);
            setTitle(res.title);
            setChatSessionId(res.id);
        });
    }

    const handleSubmit = (message: ModelMessage) => {
        setMessages([...messages, message]);
    };

    function handleTitleEdit() {
        if (!titleEdit) {
            setTitleEdit(true);
        } else {
            updateChatSession(chatSessionId, title).then((res: any) => {
                setTitle(res.title);
                setTitleEdit(false);
            });
        }
    }

    function handleAddChat() {
        createChatSession({
            title: 'New Chat',
            userId: 1
        }).then((res: any) => {
            initChatInfo(res.id);
        });
    }

    function handleCloseChat() {
        dispatch(setChatVisible(false));
    }

    function handleOpenHistory() {
        setIsHistoryOpen(true);
    }

    function handleCloseHistory() {
        setIsHistoryOpen(false);
    }

    function handleSelectChatSession(session: any) {
        initChatInfo(session.id);
    }

    return (
        <div className="ai-chat-container">
            <div className="chat-header">
                <div className="chat-header-title">
                    {titleEdit ? 
                    <Input
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        onBlur={handleTitleEdit}
                        onPressEnter={handleTitleEdit}
                        /> : <span onClick={handleTitleEdit}>{title}</span>}
                </div>

                <div className="chat-header-right">
                    <Button
                        type="text" 
                        icon={<PlusOutlined />} 
                        onClick={handleAddChat}
                    />
                    <Button type="text" icon={<HistoryOutlined />} onClick={handleOpenHistory} />
                    <AIChatHistory 
                        isOpen={isHistoryOpen} 
                        onClose={handleCloseHistory} 
                        onSelectChatSession={handleSelectChatSession}
                        onCreateChatSession={handleAddChat}
                    />
                    <Dropdown menu={{ items: [
                        {
                            label: '清空当前会话',
                            key: 'clear',
                            icon: <PlIcon type="vs-clear" />
                        }
                    ] }}>
                        <Button type="text" icon={<EllipsisOutlined />} />
                    </Dropdown>
                    <Button
                     type="text" 
                     icon={<CloseOutlined />} 
                     onClick={handleCloseChat}
                    />
                </div>
            </div>
            <div className="chat-content">
                { messages.map((message, index) => {
                    return message.role === 'user' ? 
                    <UserMessageItem key={index} message={message} /> 
                    : 
                    <AIMessageItem key={index} message={message} />
                }) }
            </div>
            <AIChatInput onSubmit={handleSubmit} />
        </div>
    )
}