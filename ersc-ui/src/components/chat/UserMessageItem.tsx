import './css/UserMessageItem.scss';

export default function UserMessage({ message }: { message: ModelMessage }) {
    return (
        <div className="user-message">
            <div className="user-message-content">{message.content}</div>
        </div>
    );
}