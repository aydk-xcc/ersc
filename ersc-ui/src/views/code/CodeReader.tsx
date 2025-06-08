import './code.scss';
import { useEffect, useState } from 'react';
import CodeSlider from './CodeSlider';
import Editor from '@/components/editor/Editor';
import { useAppSelector } from '@/stores/hooks';
import { selectCurrentProject } from '@/stores/projectSlice';
import projectApi from '@/api/projectApi';
import { Tabs } from 'antd';
import { DEFAULT_MD_CONTENT } from './defaultContent';
import AIChat from '@/components/chat/AIChat';
import { selectChatVisible } from '@/stores/chatSlice';
import ResizeDivider from '@/components/resizer/ResizeDivider';


interface FileInfo {
    name: string;
    path: string;
    content: string;
}

export default function CodeReader() {
    const currentProject = useAppSelector(selectCurrentProject);
    const chatVisible = useAppSelector(selectChatVisible);
    const [currentTab, setCurrentTab] = useState('ESRC-说明');
    const [files, setFiles] = useState<FileInfo[]>([
        {
            name: 'ESRC-说明',
            path: 'ESRC-说明',
            content: DEFAULT_MD_CONTENT,
        }
    ]);

    useEffect(() => {
        console.log('Files state updated:', files);
        console.log('Current tab:', currentTab);
    }, [files, currentTab]);

    useEffect(() => {
        console.log('Project changed, resetting files');
        setFiles([{
            name: 'ESRC-说明',
            path: 'ESRC-说明',
            content: DEFAULT_MD_CONTENT,
        }]);
        setCurrentTab('ESRC-说明');
    }, [currentProject]);

    function onFileChange(path: string) {
        console.log(path);
        const existingFile = files.find(file => file.path === path);
        if (existingFile) {
            setCurrentTab(path);
        } else {
            projectApi.getFile(currentProject?.name || '', currentProject?.version || '', currentProject?.currentType || '', path)
            .then(res => {
                const newFile = {
                    name: path.split('/').pop() || '',
                    path: path,
                    content: res.data,
                };
                setFiles(prevFiles => [...prevFiles, newFile]);
                setCurrentTab(path);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    function removeTab(targetKey: string | React.MouseEvent | React.KeyboardEvent, action: 'add' | 'remove') {
        if (action === 'remove' && typeof targetKey === 'string') {
            setFiles(prevFiles => prevFiles.filter(file => file.path !== targetKey));
            if (targetKey === currentTab) {
                const remainingFiles = files.filter(file => file.path !== targetKey);
                if (remainingFiles.length > 0) {
                    setCurrentTab(remainingFiles[0].path);
                }
            }
        }
    }

    return (
        <>
            <div className="code-container">
                <ResizeDivider 
                    direction="right"
                    minWidth={310}
                    maxWidth={500}
                >
                    <CodeSlider 
                        onFileChange={onFileChange}
                    />
                </ResizeDivider>
                <div className="code-right">
                    <Tabs
                        type='editable-card'
                        defaultActiveKey="ESRC-说明"
                        hideAdd={true}
                        tabPosition='top'
                        style={{ height: '100%' }}
                        activeKey={currentTab}
                        onChange={setCurrentTab}
                        onEdit={removeTab}
                        items={files.map((file) => {
                            console.log('Rendering tab for file:', file);
                            return {
                                label: file.name,
                                key: file.path,
                                closable: file.path !== 'ESRC-说明',
                                children: <Editor
                                    codeInfo={file.content}
                                    filePath={file.path}
                                />,
                            };
                        })}
                    />
                </div>
                {chatVisible && 
                <>
                    <ResizeDivider 
                        direction="left"
                        initialWidth={310}
                        minWidth={310}
                        maxWidth={500}
                    >
                        <AIChat />
                    </ResizeDivider>
                </>}
            </div>
        </>
    )
}