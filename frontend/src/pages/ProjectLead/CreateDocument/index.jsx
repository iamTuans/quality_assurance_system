import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import configs from '../../../.configs'
import moment from 'moment';

import "./index.css";

import { Input, Button, DatePicker, Form, Upload, Select, Tag, message } from "antd";

import {
    PlusOutlined,
} from "@ant-design/icons";

import Layout from "../../../components/Layout";

const numberOptions = [
    { value: '1', label: '0.1' },
    { value: '2', label: '0.2' }
];

const componentOptions = [
    { value: '1', label: 'Contract' },
    { value: '2', label: 'Report' },
    { value: '3', label: 'Analysis Document' },
    { value: '4', label: 'UI/UX Design Document' },
    { value: '5', label: 'Develop Document' },
    { value: '6', label: 'Test Document' },
    { value: '7', label: 'Review Document' },
    { value: '10', label: 'Other' },
];

const categoryOptions = [
    { value: '1', label: 'Open Project' },
    { value: '2', label: 'Requirement' },
    { value: '3', label: 'Design' },
    { value: '4', label: 'Development' },
    { value: '5', label: 'Testing' },
    { value: '6', label: 'Deployment' },
    { value: '7', label: 'Maintenence' },
];

const moduleOptions = [
    { value: '1', label: 'PM' },
    { value: '2', label: 'QA' },
    { value: '3', label: 'BA' },
    { value: '4', label: 'DEV' },
    { value: '5', label: 'TEST' },
];

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

    const [form] = Form.useForm();
    const variant = Form.useWatch('variant', form);

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        loading ? <div>Loading...</div> :
            <Layout>
                <div className="group-column-change-info-project-right">
                    <div className='title'>
                        <label className="title">CREATE A DOCUMENT</label>
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
                                <Select options={numberOptions} />
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
                                <Select options={componentOptions} />
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Select options={categoryOptions} />
                            </Form.Item>

                            <Form.Item
                                label="Module"
                                name="module"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Select options={moduleOptions}></Select>
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
                                <Button type="primary" onClick={() => window.location.href = `/pm`} htmlType="submit" loading={loading}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </Layout>
    )
}

export default CreateDocument;