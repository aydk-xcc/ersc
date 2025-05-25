import { Layout, Avatar, Select, Tooltip } from "antd";
import './header.scss';
import avatar from '@/assets/image/avatar.png';
import logo from '@/assets/image/logo.png';
import { OpenAIOutlined } from '@ant-design/icons';
import { useState } from "react";
import { SwapOutlined } from '@ant-design/icons';
import ChangeProjectDialog from './ChangeProjectDialog';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { selectCurrentProject } from '@/stores/projectSlice';
import { selectChatVisible, setChatVisible } from '@/stores/chatSlice';
import logoAvatar from '@/assets/image/logo.png';
import userAvatar from '@/assets/image/avatar.png';

const { Header } = Layout;


export default function PlHeader() {
    const currentProjectSlice = useAppSelector(selectCurrentProject);
    const chatVisible = useAppSelector(selectChatVisible);
    const dispatch = useAppDispatch();
    const [currentProject, setCurrentProject] = useState<Project.ProjectInfo>(() => {
        if (currentProjectSlice) {
            return currentProjectSlice;
        }
        return {
            name: '',
            version: '',
            types: [],
            currentType: ''
        }
    });
    const [dialogVisible, setDialogVisible] = useState(false);

    const showChangeProjectDialog = () => {
        setDialogVisible(true);
    };

    const handleProjectSelect = (project: Project.ProjectInfo) => {
        setCurrentProject({
            ...project
        });
        setDialogVisible(false);
    };

    function changeTypes(value: string) {
        console.log(value);
    }

    return (
        <>
            <Header className='header'>
                <div className="left">
                    <div className="title">
                        <img
                            className="logo"
                            src={logo}
                        ></img>
                        <span> ｜ </span>  
                        <div 
                            className="pro-name"
                            onClick={showChangeProjectDialog}
                        >
                            { currentProject.name ? `${currentProject.name} (${currentProject.version})` : '请选择代码库' }
                        </div>
                        <SwapOutlined />
                        {
                            currentProject.types && currentProject.types.length > 0 &&
                            <Select
                                value={currentProject?.currentType}
                                style={{ width: '100%' }}
                                placeholder="请选择版本"
                                filterOption={(input, option) => {
                                    if (!option) return false;
                                    const label = option.label?.toString().toLowerCase() || '';
                                    const value = option.value?.toString().toLowerCase() || '';
                                    const searchText = input.toLowerCase();
                                    return label.includes(searchText) || value.includes(searchText);
                                }}
                                options={currentProject.types.map((item: string) => ({
                                    label: `${item}`,
                                    value: item
                                }))}
                                onChange={changeTypes}
                            />}
                    </div>
                </div>

                <div className="right">
                    <Tooltip 
                        placement="bottom" 
                        title={chatVisible ? '关闭AI Chat' : '打开AI Chat'}
                    >
                        <OpenAIOutlined
                            className="openai-icon"
                            style={{
                                fontSize: '24px',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                dispatch(setChatVisible(!chatVisible));
                            }}
                        />
                    </Tooltip>
                    <Avatar shape="square" size={35} src={avatar} />
                </div>
            </Header>
            <ChangeProjectDialog 
                visible={dialogVisible}
                onClose={() => setDialogVisible(false)}
                onSelect={handleProjectSelect}
            />
        </>
    );
}