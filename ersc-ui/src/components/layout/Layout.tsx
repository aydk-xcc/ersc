import PlHeader from "./Header";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router";
import './layout.scss';
import {PieChartOutlined, DesktopOutlined, ContainerOutlined } from '@ant-design/icons'

const { Sider, Content } = Layout;

export default function PlLayout() {
    const navigate = useNavigate();
    const items = [
        { key: '/graph', icon: <PieChartOutlined />, label: '结构图' },
        { key: '/code', icon: <DesktopOutlined />, label: '代码' },
        { key: '/note', icon: <ContainerOutlined />, label: '笔记' }
    ];
    const handleClick = (key: string) => {
        console.log(key);
        navigate(key);
    };
    return (
        <Layout className='layout'>
            <PlHeader />
            <Layout>
            {/* <Sider
                className='sider'
                width="180px"
                theme='light'
                collapsible
            >
                <Menu
                    theme="light"
                    defaultSelectedKeys={['/graph']} 
                    mode="inline" items={items} 
                    onClick={(key) => handleClick(key.key)}
                />
            </Sider> */}
            <Content>
                <Outlet />
            </Content>
            </Layout>
      </Layout>

    )
}