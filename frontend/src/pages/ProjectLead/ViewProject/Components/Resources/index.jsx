import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import configs from '../../../../../.configs'
import moment from 'moment';

import "./index.css";

import { Button, Table, Modal, Form, Input, Select, DatePicker, message } from "antd";

import {
    PlusOutlined,
} from "@ant-design/icons";

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
    { value: '8', label: 'Other' },
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

const statusOptions = [
    { value: '1', label: 'PASS' },
];

function ViewProject_ResourcesComponent() {

    const { projectID } = useParams();
    const fileInputRef = React.useRef(null);
    const [loading, setLoading] = React.useState(false);
    const [isOpenModal, setOpenModal] = React.useState(false);
    const [isOpenReviewModal, setOpenReviewModal] = React.useState(false);
    const [isOpenEditModal, setOpenEditModal] = React.useState(false);
    const [resources, setResources] = React.useState([]);
    const [state, setState] = React.useState(null);

    const [file, setFile] = React.useState(null);

    React.useEffect(() => {
        if(state) console.log(state);
    }, [state])

    const fetchResources = async () => {
        await axios.get(`${configs.API_URL}/general/get-resources?project_code=${projectID}`, {
            headers: {
                Authorization: localStorage.getItem("token") || 'token'
            }
        })
            .then(res => {
                const buildedResources = [];
                if (res.data.resources) {
                    res.data.resources.forEach(resource => {
                        buildedResources.push({
                            ...resource,
                            key: resource._id,
                            creator: resource.creator.username,
                            created_date: moment(resource.created_date).format('DD/MM/YYYY'),
                            link: `${configs.MEDIA_BASE_URL}${resource.server_file_path}`,
                            reviewer: resource?.reviewer?.username,
                        });
                    });
                    buildedResources.reverse();
                }
                setResources(buildedResources);
            })
            .catch(err => {

            })
    }

    const changeState = (newState) => {
        if(newState) {
            setState(prev => (
                {
                    ...newState,
                    module: moduleOptions[newState.module - 1].label,
                    category: categoryOptions[newState.category - 1].label,
                    component: componentOptions[newState.component - 1].label,
                    version: numberOptions[newState.version - 1].label,                
                }
            ));
        } else setState(null);
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Creator',
            dataIndex: 'creator',
            key: 'creator',
        },
        {
            title: 'Created Date',
            dataIndex: 'created_date',
            key: 'created_date',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" size='large' onClick={() => changeState(record)} loading={loading} >View</Button>
            ),
        }
    ]

    const [form] = Form.useForm();
    const variant = Form.useWatch('variant', form);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        event.target.value = null;
    };

    const onAddResource = async (values) => {
        const formData = new FormData();
        formData.append('project_code', projectID);
        formData.append('file', file);
        formData.append('name', values.name);
        formData.append('version', values.version);
        formData.append('component', values.component);
        formData.append('category', values.category);
        formData.append('module', values.module);
        formData.append('description', values.description);
        formData.append('create_date', moment(values.create_date).format('DD-MM-YYYY'));

        await axios.post(`${configs.API_URL}/upload`, formData, {
            headers: {
                Authorization: localStorage.getItem("token") || "token",
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                message.success(res.data.message);
                form.resetFields();
                setFile(null);
                setOpenModal(false);
                fetchResources();
            })
            .catch(err => {
                message.error(err.response.data.message);
            });
    };

    React.useEffect(() => {
        setFile(file);
        fetchResources();
    }, [projectID])

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

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            {state ?
                <div className="group-column-change-info-project">
                    <Modal
                        width={500}
                        title="Review"
                        open={isOpenReviewModal}
                        onOk={async () => {
                            setLoading(true);

                            const formData = new FormData();
                            formData.append('project_code', projectID);
                            formData.append('file', file);
                            formData.append('resource_id', state._id);
                            formData.append('review_status', form.getFieldValue('status'));

                            await axios.post(`${configs.API_URL}/upload-review`, formData, {
                                headers: {
                                    Authorization: localStorage.getItem("token") || "token",
                                    'Content-Type': 'multipart/form-data'
                                }
                            })
                                .then(res => {
                                    message.success(res.data.message);
                                    form.resetFields();
                                    setFile(null);
                                    setState(prev => ({
                                        ...prev,
                                        reviewer: res.data.resource.reviewer.username,
                                        review_status: res.data.resource.review_status,
                                        review_evidence: `${res.data.resource.review_evidence}`,
                                    }));
                                })
                                .catch(err => {
                                    message.error(err.response.data.message);
                                });

                            // ToDo
                            setOpenReviewModal(false);
                            fetchResources();
                            setLoading(false);
                        }}
                        onCancel={() => setOpenReviewModal(false)}
                        okButtonProps={{
                            size: "large",
                        }}
                        cancelButtonProps={{
                            size: "large",
                        }}
                    >
                        <Form
                            {...formItemLayout}
                            form={form}
                            style={{ maxWidth: 600 }}
                        // initialValues={project}
                        >
                            <Form.Item
                                label="Status Review"
                                name="status"
                                rules={[{ required: true, message: "Please input!" }]}
                            >
                                <Select style={{ width: "100%" }} options={statusOptions} />
                            </Form.Item>
                            <Form.Item
                                    label="Evidence"
                                    name="evidence"
                                    rules={[{ required: true, message: 'Please upload a file!' }]}
                                >
                                    {file ?
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <p>{file.name}</p>
                                            <Button onClick={() => setFile(null)}>Remove</Button>
                                        </div> :
                                        <Button onClick={() => fileInputRef.current.click()}>Upload</Button>
                                    }
                                </Form.Item>
                        </Form>
                    </Modal>
                    <Modal
                        width={500}
                        title="Edit Resource"
                        open={isOpenEditModal}
                        onOk={async () => {
                            setLoading(true);
                            await axios
                                .post(`${configs.API_URL}/general/change-resource`, form.getFieldsValue(), {
                                    headers: {
                                        Authorization: localStorage.getItem("token") || "token",
                                    },
                                })
                                .then((res) => {
                                    message.success(res.data.message);
                                    localStorage.setItem('auth', JSON.stringify(form.getFieldsValue()))
                                    changeState();
                                })
                                .catch((err) => {
                                    message.error(err.response.data.message);
                                });
                            setOpenModal(false)
                            setLoading(false);
                        }}
                        onCancel={() => setOpenEditModal(false)}
                        okButtonProps={{
                            size: "large",
                        }}
                        cancelButtonProps={{
                            size: "large",
                        }}
                    >
                        <Form
                            form={form}
                            variant={variant || 'outlined'}
                            style={{ maxWidth: 600 }}
                            initialValues={state}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
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
                                name="component"
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
                        </Form>
                    </Modal>
                    <div className=''>
                        <label className="title">RESOURCE INFORMATION</label>
                    </div>
                    <div className='information-form'>
                        <div className=''>
                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Resource Name: {state.name}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>

                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Resource Version: {state.version}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>

                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Components: {state.component}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>

                            <div className='form-item'>
                                <div className='form-item-label_a' style={{ display: 'flex', gap: 5 }}>
                                    Document: <a style={{ color: 'blue', cursor: 'pointer' }} href={state.link} target='_blank'>{state.link}</a>
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>
                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Create Date: {state.created_date}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>
                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Module: {state.module}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>

                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Category: {state.category}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=''>
                        <label className="title">REVIEW</label>
                    </div>

                    <div className='information-form'>
                        <div className=''>
                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Reviewer: {state?.reviewer}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>

                            <div className='form-item'>
                                <div className='form-item-label_a'>
                                    Status Review: {state?.review_status ? 'PASS' : ''}
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>

                            <div className='form-item'>
                                <div className='form-item-label_a' style={{ display: 'flex', gap: 5 }}>
                                    Evidence: 
                                    <a style={{ color: 'blue', cursor: 'pointer' }} href={configs.MEDIA_BASE_URL + state?.review_evidence} target='_blank'>
                                        {configs.MEDIA_BASE_URL + state?.review_evidence}
                                    </a>
                                </div>
                                <div className='form-item-value'>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        padding: 10,
                        display: 'flex',
                        gap: 10,
                    }}>
                        <Button style={{
                            display: state?.creator === JSON.parse(localStorage.getItem('auth')).username ? 'block' : 'none'
                        }} type="primary" onClick={() => setOpenEditModal(true)} loading={loading}  >Edit</Button>
                        <Button type="primary" onClick={() => setOpenReviewModal(true)} loading={loading}  >Review</Button>
                        <Button type="primary"  onClick={() => changeState(null)} loading={loading} >Back</Button>
                    </div>
                </div> :
                <div>
                    <div>
                        <Modal
                            width={500}
                            title="Add Resource"
                            open={isOpenModal}
                            onOk={async () => {
                                form.setFieldValue('file', file);
                                form.validateFields()
                                    .then(async (values) => await onAddResource(values))
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }}
                            onCancel={() => setOpenModal(false)}
                            okButtonProps={{
                                size: "large",
                            }}
                            cancelButtonProps={{
                                size: "large",
                            }}
                        >
                            <Form
                                form={form}
                                variant={variant || 'outlined'}
                                style={{ maxWidth: 600 }}
                                initialValues={{ variant: 'outlined' }}
                            >
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
                                    name="component"
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
                                    label="File"
                                    name="file"
                                    rules={[{ required: true, message: 'Please upload a file!' }]}
                                >
                                    {file ?
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}>
                                            <p>{file.name}</p>
                                            <Button onClick={() => setFile(null)}>Remove</Button>
                                        </div> :
                                        <Button onClick={() => fileInputRef.current.click()}>Upload</Button>
                                    }
                                </Form.Item>
                            </Form>
                        </Modal>
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'flex-end',
                        }}>
                            <Button type="primary" size="large" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={() => setOpenModal(true)}>
                                Add Resource
                            </Button>
                        </div>
                        <Table columns={columns} dataSource={resources} />
                    </div>
                </div>}

        </>
    )
}

export default ViewProject_ResourcesComponent;