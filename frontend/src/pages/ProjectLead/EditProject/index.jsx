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
    message
} from 'antd';

import Layout from '../../../components/Layout';
import { useNavigate } from 'react-router-dom';


const rankOptions = [
    { value: 'A', label: 'Rank A' },
    { value: 'B', label: 'Rank B' },
    { value: 'C', label: 'Rank C' },
    { value: 'D', label: 'Rank D' },
]

const categoryOptions = [
    { value: 'SW', label: 'Software' },
    { value: 'HW', label: 'Hardware' },
]

const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'pending', label: 'Pending' },
    { value: 'close', label: 'Close' },
]

function EditProject() {

    const navigate = useNavigate();
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
    const [submitLoading, setSubmitLoading] = React.useState(false);

    const fetchProjectInfo = async () => {
        setLoading(true);
        await axios.get(`${configs.API_URL}/general/get-project-info?project_code=${projectID}`, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                const buildedProject = {
                    ...res.data.project,
                    start_date: res.data.project.start_date ? moment(res.data.project.start_date) : null,
                    end_date: res.data.project.end_date ? moment(res.data.project.end_date) : null
                }
                setProject(prev => buildedProject);
            })
            .catch(err => {
                message.error(err.response.data.message);
            })
        setLoading(false);
    }

    React.useEffect(() => {
        fetchProjectInfo();
    }, [projectID]);

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

    return (
        <Layout>
            {
                loading ?
                    <div className="loading"></div> :
                    project?.code ?
                        <div className="group-column-change-info-project-right">
                            <div className='title'>
                                <label className="title">CHANGE PROJECT INFOMATION</label>
                            </div>
                            <div className="group-change-info-project">
                                <Form
                                    {...formItemLayout}
                                    form={form}
                                    style={{ maxWidth: 600 }}
                                    initialValues={project}
                                    onFinish={async () => {
                                        setSubmitLoading(true);
                                        await axios.post(`${configs.API_URL}/pm/change-project-info`, form.getFieldsValue(), {
                                            headers: {
                                                Authorization: localStorage.getItem("token") || "token"
                                            }
                                        })
                                        .then(res => {
                                            message.success(res.data.message);
                                            navigate('/pm');
                                        })
                                        .catch(err => {
                                            message.error(err.response.data.message);
                                        })
                                        setSubmitLoading(false);
                                    }}
                                >

                                    <Form.Item
                                        label="Project Code"
                                        name="code"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <Input disabled/>
                                    </Form.Item>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <Input.TextArea style={{ width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item
                                        label="Rank"
                                        name="rank"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <Select options={rankOptions}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Category"
                                        name="category"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <Select options={categoryOptions}/>
                                    </Form.Item>

                                    <Form.Item
                                        label="Start Date"
                                        name="start_date"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format="DD/MM/YYYY"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="End Date"
                                        name="end_date"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <DatePicker
                                            style={{ width: '100%' }}
                                            format="DD/MM/YYYY"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Customer"
                                        name="customer"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <Input.TextArea />
                                    </Form.Item>

                                    <Form.Item
                                        label="Status"
                                        name="status"
                                        rules={[{ required: true, message: 'Please input!' }]}
                                    >
                                        <Select options={statusOptions}/>
                                    </Form.Item>

                                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                        <Button type="primary" htmlType='submit' loading={submitLoading}>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div> : <div>Project not found</div>
            }
        </Layout>
    )
}

export default EditProject;