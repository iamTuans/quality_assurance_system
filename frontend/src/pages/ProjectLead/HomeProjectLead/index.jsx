import React from 'react';
import './index.css';

import { Menu, Table } from 'antd';
import { HomeOutlined, KeyOutlined, FormOutlined, MailOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';

function HomeProjectLead() {

    const items = [
        {
            key: 'sub0',
            label: 'Home',
            icon: <HomeOutlined />
        },

        {
            key: 'sub1',
            label: 'User Information',
            icon: <FormOutlined />
        },


        {
            key: 'sub2',
            label: 'Change Password',
            icon: <KeyOutlined />
        },

        {
            key: 'sub4',
            label: 'Setting',
            icon: <SettingOutlined />,
            children: [
                {
                    key: 'log-out',
                    label: 'Log Out'
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
            </div>
        </>
    );
}

export default HomeProjectLead;