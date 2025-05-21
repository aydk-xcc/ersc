import './code.scss';
import { useEffect, useState } from 'react';
import CodeSlider from './CodeSlider';
import Editor from '@/components/editor/Editor';
import { useAppSelector } from '@/stores/hooks';
import { selectCurrentProject } from '@/stores/projectSlice';
import projectApi from '@/api/projectApi';

export default function CodeReader() {
    const currentProject = useAppSelector(selectCurrentProject);
    const [currentFilePath, setCurrentFilePath] = useState('');
    useEffect(() => {
        if (currentProject) {
            console.log(currentProject);
        }
    }, [currentProject]);

    function onFileChange(path: string) {
        console.log(path);
        projectApi.getFile(currentProject?.name || '', currentProject?.version || '', currentProject?.currentType || '', path)
            .then(res => {
                console.log(res);
                setCurrentFilePath(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <>
            <div className="code-container">
                <CodeSlider 
                    onFileChange={onFileChange}
                />
                <div className="code-right">
                    <Editor
                        codeInfo={currentFilePath}
                    />
                </div>
            </div>
        </>
    )
}