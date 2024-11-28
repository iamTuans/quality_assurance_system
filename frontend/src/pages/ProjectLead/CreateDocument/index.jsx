import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import configs from '../../../.configs'
import moment from 'moment';

import "./index.css";

import {
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    Table,
    Tag,
    Menu,
    Upload
} from 'antd';

import {
    HomeOutlined,
    KeyOutlined,
    FormOutlined,
    SettingOutlined,
    PlusOutlined,
    UnorderedListOutlined,
    AppstoreAddOutlined,
} from "@ant-design/icons";

function CreateDocument() {

    const { projectID } = useParams();
    const [project, setProject] = React.useState({
        key: null,
        code: null,
        name: null,
        leader: null,
        rank: null,
        category: null,
        start_date: null,
        end_date: null,
        customer: null,
        status: null
    });
    const [loading, setLoading] = React.useState(false);

    const { RangePicker } = DatePicker;

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    const items = [
        {
            key: 'sub0',
            label: 'Home',
            icon: <HomeOutlined />,
            onClick: () => {
                window.location.href = '/pm/home';
            }
        },

        {
            key: 'sub2',
            label: 'Create',
            icon: <AppstoreAddOutlined />,
            children: [
                {
                    key: 'create-task',
                    label: 'Create Task',
                },
                {
                    key: 'create-doc',
                    label: 'Create Document',
                    onClick: () => {
                        window.location.href = '/create-document';
                    }
                },
                {
                    key: 'create-bug',
                    label: 'Create Defect',
                },
            ],
        },

        {
            key: 'sub3',
            label: 'User Information',
            icon: <FormOutlined />,
            children: [
                {
                    key: 'view',
                    label: 'View Information',
                },
                {
                    key: 'change-info',
                    label: 'Change Information',
                    onClick: () => {
                        window.location.href = '/pm/change-info';
                    }
                },
            ],
        },

        {
            key: 'sub4',
            label: 'Setting',
            icon: <SettingOutlined />,
            children: [
                {
                    key: 'change-pass',
                    label: 'Change Password',
                },
                {
                    key: 'log-out',
                    label: 'Log Out',
                    onClick: () => {
                        window.location.href = '/logout';
                    },
                },
            ],
        }
    ];

    const [form] = Form.useForm();
    const variant = Form.useWatch('variant', form);

    const onClick = (e) => {
        console.log('click ', e);
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        loading ? <div>Loading...</div> :
            <div className='group'>
                <div className="group-column-change-info-project-left">
                    <Menu
                        onClick={onClick}
                        style={{ width: 256 }}
                        mode="inline"
                        items={items}
                    />
                </div>
                <div className="group-column-change-info-project-right">
                    <div className='title'>
                        <label className="title">CREATE A PROJECT</label>
                    </div>
                    <div className="group-change-info-project">
                        <Form
                            {...formItemLayout}
                            form={form}
                            variant={variant || 'outlined'}
                            style={{ maxWidth: 600 }}
                            initialValues={{ variant: 'outlined' }}
                        >

                            <Form.Item label="Project" name="project" rules={[{ required: true, message: 'Please input!' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="Creator"
                                name="creator"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Version"
                                name="version"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Create date"
                                name="create_date"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    defaultValue={project?.start_date ? moment(project?.start_date, "YYYY-MM-DD") : null}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                label="Components"
                                name="components"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Module"
                                name="module"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item 
                            label="Upload" 
                            valuePropName="fileList" 
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: 'Please upload a file!' }]}
                            >
                                <Upload action="/upload.do" listType="picture-card">
                                    <button
                                        style={{
                                            border: 0,
                                            background: 'none',
                                            width: '100%'  // Fixed the syntax error here
                                        }}
                                        type="button"
                                    >
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Upload
                                        </div>
                                    </button>
                                </Upload>
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                <Button type="primary" onClick={() => window.location.href = `/pm/home`} htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
    )
}

export default CreateDocument;