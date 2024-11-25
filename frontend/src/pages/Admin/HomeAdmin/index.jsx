import React from 'react';
import './index.css';
// import { useNavigate } from 'react-router-dom';

import { Menu, Table } from 'antd';
import { HomeOutlined, AppstoreOutlined, MailOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';

function HomeAdmin() {

    // const navigate = useNavigate();

    // const homeAdmin = () => {
    //     navigate('/admin/home-admin');
    // }

    // useEffect(() => {
    //     homeAdmin();
    // }, [])

    const items = [
        {
            key: 'sub0',
            label: 'Home',
            icon: <HomeOutlined />,
            onClick: () => {
                window.location.href = '/';
            }
        },
        {
            key: 'sub1',
            label: 'Project Manager',
            icon: <MailOutlined />,
            children: [
                {
                    key: 'create-a-project',
                    label: 'Create a Project',
                    onClick: () => {
                        window.location.href = '/admin/project-manager';
                    }
                },
            ],
        },
        {
            key: 'sub2',
            label: 'User Manager',
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: 'create-a-user',
                    label: 'Create a User',
                },
            ],
        },
        {
            key: 'sub4',
            label: 'Setting',
            icon: <SettingOutlined />,
            children: [
                {
                    key: 'log-out',
                    label: 'Log Out',
                    onClick: () => {
                        window.location.href = '/logout';
                    }
                },
            ],
        },
    ];

    const projectColumns = [
        {
            title: "Project Code",
            dataIndex: "code",
            key: "code"
        },
        {
            title: "Project Name",
            dataIndex: "name",
            key: "name"
        },
    ];

    const userColumns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
    ];

    const onClick = (e) => {
        console.log('click ', e);
    };

    return (
        <>
            <div className='group-home'>
                <div className='menu-home'>
                    <Menu
                        onClick={onClick}
                        style={{ width: 256 }}
                        mode="inline"
                        items={items}
                    />
                </div>
                <div className='info-home'>
                    <div>
                        <UnorderedListOutlined />
                        <label className="title">PROJECT LIST</label>
                    </div>
                    <div>
                        <Table columns={projectColumns} />
                    </div>
                </div>
                <div className='info-home'>
                    <div>
                        <UnorderedListOutlined />
                        <label className="title">USER LIST</label>
                    </div>
                    <div>
                        <Table columns={userColumns} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default HomeAdmin;