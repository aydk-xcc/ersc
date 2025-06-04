import { Button, Input, Modal } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import './css/AIChatHistory.scss';
import { deleteChatSession, getUserChatSessions } from '@/api/sessionApi';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function AIChatHistory({ isOpen, onClose, onSelectChatSession, onCreateChatSession }: { isOpen: boolean, onClose: () => void, onSelectChatSession: (session: any) => void, onCreateChatSession: () => void }) {
    const [chatSessions, setChatSessions] = useState<any[]>([]);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            getChatSessions();
        }
    }, [isOpen]);

    const filteredChatSessions = useMemo(() => {
        return chatSessions.filter((session) => {
            const title = session.title.toLowerCase();
            const search = searchValue.toLowerCase();
            return title.includes(search);
        });
    }, [chatSessions, searchValue]);

    function getChatSessions() {
        getUserChatSessions('1').then((res: any) => {
            setChatSessions(res);
        });
    }

    function handleDeleteChatSession(session: any) {
        Modal.confirm({
            title: `是否删除会话[${session.title}]`,
            onOk: () => {
                deleteChatSession(session.id).then((res: any) => {
                    getChatSessions();
                });
            }
        });
    }

    function handleCreateChatSession() {
        onClose();
        onCreateChatSession();
    }

    return (
        <Modal
            classNames={{
                mask: 'ai-chat-history-mask',
                content: 'ai-chat-history-content'
            }}
            destroyOnHidden={true}
            footer={null}
            style={{ top: '40px' }}
            closable={false}
            width={640}
            open={isOpen}
            onCancel={onClose}
        >
            <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="输入会话关键字"
                className="ai-chat-history-search"
            />
            <Button
                type="primary"
                className="ai-chat-history-create-btn"
                onClick={handleCreateChatSession}
            >开始新的会话</Button>
            <div className="ai-chat-history-list">
                {filteredChatSessions.map((session) => (
                    <div
                        className="ai-chat-history-item"
                        key={session.id}
                        onClick={() => {
                            onSelectChatSession(session);
                            onClose();
                        }}
                    >
                        <div className="ai-chat-history-item-title">
                            <span className="title">{session.title}</span>
                            <span className="time">{dayjs(session.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </div>
                        <Button
                            className="ai-chat-history-item-delete-btn"
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChatSession(session);
                            }}
                        />
                    </div>
                ))}
            </div>
        </Modal>
    );
}