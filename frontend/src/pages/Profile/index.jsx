import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import configs from '../../.configs'
import moment from 'moment';

import "./index.css";

import {
    Button,
    DatePicker,
    Form,
    Input,
    Select,
    message
} from 'antd';

import Layout from '../../components/Layout';

const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
];

function Profile() {

    const [state, setState] = React.useState(0);
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

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

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem("auth"));
        if (user && user.date_of_birth) {
            user.date_of_birth = moment(user.date_of_birth);
        }
        setUser(user);
    }, [state]);

    return (
        <Layout>
            {state ?
                <div className="group-column-change-info-project">
                    <div className='title'>
                        <label className="title">CHANGE USER INFOMATION</label>
                    </div>
                    <div className="group-change-info-project">
                        <Form
                            {...formItemLayout}
                            form={form}
                            style={{ maxWidth: 600 }}
                            initialValues={user}
                            onFinish={async () => {
                                setLoading(true);
                                await axios.post(`${configs.API_URL}/general/change-info`, form.getFieldsValue(), {
                                    headers: {
                                        Authorization: localStorage.getItem("token") || "token"
                                    }
                                })
                                    .then(res => {
                                        message.success(res.data.message);
                                        localStorage.setItem('auth', JSON.stringify(form.getFieldsValue()))
                                        changeState();
                                    })
                                    .catch(err => {
                                        message.error(err.response.data.message);
                                    })
                                setLoading(false);
                            }}
                        >

                            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input!' }]}>
                                <Input disabled />
                            </Form.Item>

                            <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please input!' }]} hidden>
                                <Input disabled />
                            </Form.Item>


                            <Form.Item
                                label="Full Name"
                                name="full_name"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item
                                label="Gender"
                                name="gender"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Select options={genderOptions} />
                            </Form.Item>

                            <Form.Item
                                label="DoB"
                                name="date_of_birth"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD/MM/YYYY"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Job"
                                name="job"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Department"
                                name="department"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Company"
                                name="company"
                                rules={[{ required: true, message: 'Please input!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Submit
                                </Button>
                                <Button type="default" style={{
                                    marginLeft: 10
                                }} onClick={() => changeState()} loading={loading}>
                                    Cancel
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div> : <div className="group-column-change-info-project">
                    <div className=''>
                        <label className="title">USER INFOMATION</label>
                    </div>
                    <div className='information-form'>
                        <div className='form-item'>
                            <div className='form-item-label'>
                                Username:
                            </div>
                            <div className='form-item-value'>
                                {user?.username}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Fullname:
                            </div>
                            <div className='form-item-value'>
                                {user?.full_name}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Gender:
                            </div>
                            <div className='form-item-value'>
                                {user?.gender}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                DoB:
                            </div>
                            <div className='form-item-value'>
                                {/* Kiểm tra nếu user tồn tại và có date_of_birth */}
                                {user && user.date_of_birth ? moment(user.date_of_birth).format('DD/MM/YYYY') : ''}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Job:
                            </div>
                            <div className='form-item-value'>
                                {user?.job}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Department:
                            </div>
                            <div className='form-item-value'>
                                {user?.department}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                                Company:
                            </div>
                            <div className='form-item-value'>
                                {user?.company}
                            </div>
                        </div>

                        <div className='form-item'>
                            <div className='form-item-label'>
                            </div>
                            <div className='form-item-edit'>
                            <Button type="primary" onClick={() => changeState()}>Edit</Button>
                            </div>
                        </div>
{/* 
                        <div className='button-edit'>
                            <Button type="primary" onClick={() => changeState()}>Edit</Button>
                        </div> */}
                    </div>
                </div>}
        </Layout>
    )
}

export default Profile;