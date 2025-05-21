import { useState, useEffect, useRef } from 'react';
import { Tree, Spin } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import './slider.scss';
import { SearchOutlined, ChromeOutlined, DownOutlined} from '@ant-design/icons';
import PlIcon from '@/components/icon/PlIcon';
import { useAppSelector } from '@/stores/hooks';
import { selectCurrentProject } from '@/stores/projectSlice';
import projectApi from '@/api/projectApi';
import { getTreeData } from './treeData';
import { isDir, getFileExt } from '@/utils/file';


export default function CodeSlider({onFileChange}: {onFileChange: (path: string) => void}) {
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [treeData, setTreeData] = useState<Array<TreeDataNode>>([]);
    const currentProject = useAppSelector(selectCurrentProject);
    const [loading, setLoading] = useState(false);
    const state = useRef(false);
    useEffect(() => {
        if (currentProject) {
            setLoading(true);
            projectApi.getProjectFileList(currentProject.name, currentProject.version || '', currentProject.currentType)
                .then(res => {
                    if (!state.current) {
                        let treeData = getTreeData(res.data.sort());
                        setTreeData(treeData);
                        console.log(treeData);
                        // setExpandedKeys([treeData[0].key]);
                        state.current = true;
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [currentProject]);

    function renderIcon(nodeProps: any) {
        const node = nodeProps.data as TreeDataNode;
        const expanded = nodeProps.expanded;
        if (node && isDir(node.key as string)) {
            return <PlIcon type={expanded ? 'vs-folder-line' : 'vs-folder'} />;
        } else if (node) {
            return <PlIcon type={`vs-${getFileExt(node.key as string)}`} />;
        }
        return null;
    }

    function onSelect(selectedKeys: string[], info: any) {
        console.log(selectedKeys, info);
        const node = info.node as TreeDataNode;
        if (!isDir(node.key as string)) {
            onFileChange(node.key as string);
        }
    }

    return (
        <div
            className="code-left"
        >
            <Spin
                spinning={loading}
                size="small"
            />
            <div className="code-left-header">
                <SearchOutlined />
                <ChromeOutlined />
            </div>
            <Tree
                className="draggable-tree"
                defaultExpandedKeys={expandedKeys}
                switcherIcon={<DownOutlined />}
                showLine
                blockNode
                showIcon
                icon={renderIcon}
                treeData={treeData}
                onSelect={onSelect}
            />
        </div>
    )
}