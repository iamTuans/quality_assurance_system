import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import configs from '../../../.configs'
import moment from 'moment';

import {
    Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Mentions,
    Select,
    TreeSelect,
    Segmented,
} from 'antd';

function EditProject() {

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

    const fetchProjectInfo = async () => {
        setLoading(true);
        await axios.get(`${configs.API_URL}/general/get-project-info?project_code=${projectID}`, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                setProject(_prev => res.data.project);
            })
            .catch(err => {
                alert("Something went wrong!")
            })
        setLoading(false);
    }

    React.useEffect(() => {
        fetchProjectInfo();
    }, []);

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

    return (
        loading ? <div>Loading...</div> :
            project?.code === null ?
                <div>Project not found!</div> :
                <div>
                    <div>
                        {project?.code}
                    </div>

                    <div>
                        {project?.name}
                    </div>

                    <div>
                        {project?.start_date ? moment(project?.start_date).format("DD/MM/YYYY") : "Not set yet"}
                    </div>
                    <div>
                        <Form
                            {...formItemLayout}
                            form={form}
                            variant={variant || 'outlined'}
                            style={{ maxWidth: 600 }}
                            initialValues={{ variant: 'outlined' }}
                        >

                            <Form.Item label="Project Code" name="project_code" rules={[{ required: true, message: 'Please input!' }]}>
                                <Input />
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
                                <Select />
                            </Form.Item>

                            <Form.Item
                                label="Category"
                                name="category"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                            <Select />
                            </Form.Item>

                            <Form.Item
                                label="Start Date"
                                name="start_date"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="End Date"
                                name="end_date"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
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
                                <Select />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                <Button type="primary" onClick={() => window.location.href = `/pm/home`} htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
    )
}

export default EditProject;