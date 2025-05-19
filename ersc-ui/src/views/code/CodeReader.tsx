import './code.scss';
import CodeSlider from './CodeSlider';
import Editor from '@/components/editor/Editor';
export default function CodeReader() {
    return (
        <>
            <div className="code-container">
                <CodeSlider />
                <div className="code-right">
                    <Editor />
                </div>
            </div>
        </>
    )
}