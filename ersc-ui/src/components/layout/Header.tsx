import { Layout, Avatar } from "antd";
import './header.scss';
import projectApi from '@/api/projectApi';
import avatar from '@/assets/image/avatar.png';
import logo from '@/assets/image/logo.png';
import { useState, useEffect } from "react";
import { SwapOutlined } from '@ant-design/icons';
import ChangeProjectDialog from './ChangeProjectDialog';

const { Header } = Layout;

interface Project {
    id: string;
    name: string;
    version: string;
}

export default function PlHeader() {
    const [currentProject, setCurrentProject] = useState<Project>({
        id: '',
        name: 'react',
        version: '1.0.0'
    });
    const [dialogVisible, setDialogVisible] = useState(false);

    const showChangeProjectDialog = () => {
        setDialogVisible(true);
    };

    const handleProjectSelect = (project: Project) => {
        setCurrentProject(project);
        setDialogVisible(false);
    };

    return (
        <>
            <Header className='header'>
                <div className="left">
                    <div className="title">
                        <img
                            className="logo"
                            src={logo}
                        ></img>
                        <span v-if="currentProject.id"> ｜ </span>  
                        <span v-if="currentProject.id"
                            className="pro-name"
                            onClick={showChangeProjectDialog}
                        >
                            { currentProject.name }({ currentProject.version })
                            <SwapOutlined />
                        </span>
                    </div>
                </div>
                <div className="right">
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