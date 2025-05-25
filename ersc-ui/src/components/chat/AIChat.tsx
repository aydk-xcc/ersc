import './AIChat.scss';
import AIChatInput from './AIChatInput';

export default function AIChat() {
    return (
        <div className="ai-chat-container">
            <div className="chat-header">
                <div className="ai-chat-header-left">
                    <div className="ai-chat-header-left-title">
                        AI Chat
                    </div>
                </div>
            </div>
            <div className="chat-content">

            </div>
            <AIChatInput />
        </div>
    )
}