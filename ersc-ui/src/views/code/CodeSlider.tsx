import { useState, useEffect, useRef } from 'react';
import { Tree, Spin } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import type { Key } from 'react';
import './slider.scss';
import { 
    SearchOutlined, 
    ChromeOutlined, 
    DownOutlined, 
    SnippetsOutlined,
    BranchesOutlined
} from '@ant-design/icons';
import PlIcon from '@/components/icon/PlIcon';
import { useAppSelector } from '@/stores/hooks';
import { selectCurrentProject } from '@/stores/projectSlice';
import projectApi from '@/api/projectApi';
import { getTreeData } from './treeData';
import { isDir, getFileExt } from '@/utils/file';


export default function CodeSlider({onFileChange}: {onFileChange: (path: string) => void}) {
    const [expandedKeys, setExpandedKeys] = useState<Key[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    const [treeData, setTreeData] = useState<Array<TreeDataNode>>([]);
    const currentProject = useAppSelector(selectCurrentProject);
    const [loading, setLoading] = useState(false);
    const state = useRef(false);
    const [currentTab, setCurrentTab] = useState('files');
    
    useEffect(() => {
        if (currentProject) {
            setLoading(true);
            setSelectedKeys([]);
            setExpandedKeys([]); // 先清空展开状态
            // 重置状态，允许重新加载
            state.current = false;
            projectApi.getProjectFileList(currentProject.name, currentProject.version || '', currentProject.currentType)
                .then(res => {
                    let newTreeData = getTreeData(res.data.sort());
                    setTreeData(newTreeData);
                    console.log('Tree data loaded:', newTreeData);
                    state.current = true;
                })
                .catch(err => {
                    console.error('Failed to load file list:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // 如果没有选择项目，清空所有状态
            setTreeData([]);
            setExpandedKeys([]);
            setSelectedKeys([]);
        }
    }, [currentProject]);

    // 当树形数据更新时，设置默认展开状态
    useEffect(() => {
        if (treeData.length > 0) {
            const firstLevelKeys: Key[] = [];
            treeData.forEach(node => {
                if (isDir(node.key as string) && node.children && node.children.length > 0) {
                    firstLevelKeys.push(node.key);
                }
            });
            
            console.log('Final expanded keys to set:', firstLevelKeys);
            if (firstLevelKeys.length > 0) {
                setExpandedKeys(firstLevelKeys);
            }
        }
    }, [treeData]);

    // 处理展开/收起事件
    const onExpand = (expandedKeysValue: Key[]) => {
        console.log('onExpand', expandedKeysValue);
        setExpandedKeys(expandedKeysValue);
    };

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

    function onSelect(selectedKeys: Key[], info: any) {
        const node = info.node as TreeDataNode;
        if (!isDir(node.key as string)) {
            setSelectedKeys(selectedKeys);
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
                <SnippetsOutlined
                    className={`${currentTab === 'files' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('files')}
                />
                <SearchOutlined
                    className={`${currentTab === 'search' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('search')}
                />
                <BranchesOutlined
                    className={`${currentTab === 'branches' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('branches')}
                />
                <ChromeOutlined
                    className={`${currentTab === 'chrome' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('chrome')}
                />
            </div>
            <Tree
                className="draggable-tree"
                expandedKeys={expandedKeys}
                onExpand={onExpand}
                selectedKeys={selectedKeys}
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