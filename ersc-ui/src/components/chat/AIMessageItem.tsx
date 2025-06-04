import './css/AIMessageItem.scss';
import 'github-markdown-css/github-markdown-light.css';
import 'highlight.js/styles/github.css';
import PlIcon from '../icon/PlIcon';
import { Button } from 'antd';
import MarkdownIt from 'markdown-it';
import markdownItHighlightjs from 'markdown-it-highlightjs';
import markdownItAnchor from 'markdown-it-anchor';

export default function AIMessage({ message }: { message: ModelMessage }) {
    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
    })
    .use(markdownItHighlightjs)
    .use(markdownItAnchor);
    
    const html = md.render(message.content);
    return (
        <div className="ai-message">
            <div className="ai-message-header">
                <Button className="ai-message-header-button" type="text" icon={<PlIcon type="vs-deepseek" />} />
                <span>DeepSeek</span>
            </div>
            <div className="ai-message-content">
                <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        </div>
    );
}