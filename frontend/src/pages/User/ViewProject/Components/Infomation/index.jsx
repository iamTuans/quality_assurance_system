import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import configs from '../../../../../.configs'
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
    Modal,
    message
} from 'antd';

import { useNavigate } from 'react-router-dom';

const rankOptions = [
    { value: 'A', label: 'Rank A' },
    { value: 'B', label: 'Rank B' },
    { value: 'C', label: 'Rank C' },
    { value: 'D', label: 'Rank D' },
]

const categoryOptions = [
    { value: 'Software', label: 'Software' },
    { value: 'Hardware', label: 'Hardware' },
]

const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Close', label: 'Close' },
]

function ViewProject_InformationComponent() {

    const [state, setState] = React.useState(0);

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
    const [isOpenModal, setOpenModal] = React.useState(false);

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
    }, [projectID, state]);

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

    const changeState = () => {
        setState(prev => !prev);
    }

    return (
        <>
            <Modal
                width={500}
                title="Change Project Infomation"
                open={isOpenModal}
                onOk={async () => {
                    setLoading(true);
                    await axios
                        .post(`${configs.API_URL}/pm/change-project-info`, form.getFieldsValue(), {
                            headers: {
                                Authorization: localStorage.getItem("token") || "token",
                            },
                        })
                        .then((res) => {
                            message.success(res.data.message);
                            changeState();
                        })
                        .catch((err) => {
                            message.error(err.response.data.message);
                        });
                    setOpenModal(false)
                    setLoading(false);
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
                    {...formItemLayout}
                    form={form}
                    style={{ maxWidth: 600 }}
                    initialValues={project}
                >
                    <Form.Item
                        label="Project Code"
                        name="code"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <Input.TextArea style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Rank"
                        name="rank"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <Select options={rankOptions} />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <Select options={categoryOptions} />
                    </Form.Item>

                    <Form.Item
                        label="Start Date"
                        name="start_date"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        label="End Date"
                        name="end_date"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
                    </Form.Item>

                    <Form.Item
                        label="Customer"
                        name="customer"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please input!" }]}
                    >
                        <Select options={statusOptions} />
                    </Form.Item>
                </Form>
            </Modal>


            <div className="group-column-change-info-project">
                <div className=''>
                    <label className="title">PROJECT INFOMATION</label>
                </div>
                <div className='information-form'>
                    <div className=''>
                        <div className='form-item'>
                            <div className='form-item-label'>
                                Project Code:
                            </div>
                            <div className='form-item-value'>
                                {project?.code}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Project Name:
                            </div>
                            <div className='form-item-value'>
                                {project?.name}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Rank:
                            </div>
                            <div className='form-item-value'>
                                {project?.rank}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Category:
                            </div>
                            <div className='form-item-value'>
                                {project?.category}
                            </div>
                        </div>
                    </div>

                    <div className=''>
                        <div className='form-item'>
                            <div className='form-item-label'>
                                Start Date:
                            </div>
                            <div className='form-item-value'>
                                {/* {project?.start_date} */}
                                {project && project.start_date ? moment(project.start_date).format('DD/MM/YYYY') : ''}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                End Date:
                            </div>
                            <div className='form-item-value'>
                            {project && project.end_date ? moment(project.end_date).format('DD/MM/YYYY') : ''}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Customer:
                            </div>
                            <div className='form-item-value'>
                                {project?.customer}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Status:
                            </div>
                            <div className='form-item-value'>
                                {project?.status}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default ViewProject_InformationComponent;