import React, { useState } from "react";
import configs from "../../../.configs";
import axios from "axios";
import moment from 'moment';

import "./index.css";

import { Input, Table, Tag, message, Tabs, Button, Select, DatePicker } from "antd";

import {
    SearchOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';

import Layout from "../../../components/Layout";

function ViewProject() {
    // Declare a state variable for size with default value "middle"
    const [size, setSize] = useState("middle");
    const [user, setUser] = useState({
        username: "john_doe",
        full_name: "John Doe",
        gender: "Male",
        date_of_birth: "1990-01-01",
        job: "Software Engineer",
        department: "Development",
        company: "TechCorp"
    });

    // Handle radio button change
    const onChange = (e) => {
        setSize(e.target.value);
    };

    const columns = [
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
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: role => {
                let colors = {
                    admin: 'red',
                    pm: 'green',
                    user: 'gray',
                    ba: 'blue',
                    qa: 'purple'
                }
                return (
                    <Tag color={colors[role]} key={role}>
                        {role.toUpperCase()}
                    </Tag>
                )
            }
        },
        {
            title: 'Start Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => {
                return moment(date).format("DD-MM-YYYY")
            }
        },
        {
            title: 'End Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => {
                return moment(date).format("DD-MM-YYYY")
            }
        }
    ]
    const roleOptions = [
        { value: 'qa', label: 'QA' },
        { value: 'ba', label: 'BA' },
        { value: 'uiux', label: 'UIUX' },
        { value: 'dev', label: 'DEV' },
        { value: 'cm', label: 'CM' },
        { value: 'pd', label: 'PD' },
    ]

    return (
        <div>
            <Layout>
                <div className="group-info-project">
                    <div>
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size={size}
                            items={new Array(3).fill(null).map((_, i) => {
                                const id = String(i + 1);
                                return {
                                    label: i === 0 ? 'Summary' : (i === 1 ? 'Information' : 'Resource'),
                                    key: id,
                                    children: i === 0
                                        ? (
                                            <div>
                                                <h2>Resources</h2>
                                                <p>This is the content of the Resource tab. Here you can add details about resources for the project.</p>
                                                <ul>
                                                    <li>Resource 1: Available</li>
                                                    <li>Resource 2: Pending</li>
                                                </ul>
                                            </div>
                                        )
                                        : i === 1
                                            ? (
                                                <div className="aaa">
                                                    <div className="information-form">
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Project Code:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Project Name:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Rank:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Category:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Status:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                    </div>
                                                    <div className="information-form">
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Project Lead:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Start Date:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>End Date:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'>Customer:</div>
                                                            <div className='form-item-value'></div>
                                                        </div>
                                                        <div className='form-item'>
                                                            <div className='form-item-label'></div>
                                                            <div className='form-item-edit'>
                                                                <Button type="primary">Edit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            : (
                                                <div className="group-add-user">
                                                    <div>
                                                        <PlusCircleOutlined />
                                                        <label className="title">ADD USER TO PROJECT</label>
                                                    </div>
                                                    <div className="add-user">
                                                        <Input placeholder="Username" size="large" />
                                                        <Select options={roleOptions} placeholder="Role" size="large" />
                                                        <DatePicker
                                                            placeholder="Start Date"
                                                            style={{ width: '100%' }}
                                                            format="DD/MM/YYYY"
                                                        />
                                                        <DatePicker
                                                            placeholder="End Date"
                                                            style={{ width: '100%' }}
                                                            format="DD/MM/YYYY"
                                                        />
                                                        <Button type="primary" size="large">Add</Button>
                                                    </div>
                                                    <div>
                                                        <UnorderedListOutlined />
                                                        <label className="title">RESOURCE ALOWCATE</label>
                                                    </div>
                                                    <div>
                                                        <Table columns={columns} />
                                                    </div>
                                                </div>
                                            )
                                };
                            })}
                        />
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default ViewProject;