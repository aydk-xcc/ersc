import './css/AIMessageItem.scss';
import PlIcon from '../icon/PlIcon';
import { Button } from 'antd';

export default function AIMessage({ message }: { message: ModelMessage }) {
    return (
        <div className="ai-message">
            <div className="ai-message-header">
                <Button className="ai-message-header-button" type="text" icon={<PlIcon type="vs-deepseek" />} />
                <span>DeepSeek</span>
            </div>
            <div className="ai-message-content">
                {message.content}
            </div>
        </div>
    );
}