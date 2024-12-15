import { Mentions, Input, Table, Tag, message, Tabs, Button, Select, DatePicker } from "antd";
import React from "react";
import { useParams } from 'react-router-dom'
import {
    SearchOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios'
import configs from '../../../../../.configs'

function ViewProject_MembersComponent() {

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
            dataIndex: 'start_date',
            key: 'start_date',
            render: date => {
                return moment(date).format("DD-MM-YYYY")
            }
        },
        {
            title: 'End Date',
            dataIndex: 'end_date',
            key: 'end_date',
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
        { value: 'test', label: 'TEST' },
    ]

    const { projectID } = useParams();
    const [newUser, setNewUser] = React.useState({
        username: '',
        name: '',
        role: '',
        start_date: '',
        end_date: ''
    });
    const [users, setUsers] = React.useState([]);

    const fetchUserList = async () => {
        await axios.get(`${configs.API_URL}/general/get-users-in-project?project_code=${projectID}`, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
        .then(res => {
            const buildedUsers = [];
            if(res.data.users) {
                res.data.users.forEach(user => {
                    buildedUsers.push({
                        key: user.user_id._id,
                        username: user.user_id.username,
                        name: user.user_id?.name,
                        role: user.role,
                        start_date: user.start_date,
                        end_date: user.end_date
                    })
                })
            }
            setUsers(buildedUsers);
        })
        .catch(err => {

        })
    }

    const handleAddUser = async () => {
        await axios.post(`${configs.API_URL}/pm/add-user-to-project`, newUser, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
        .then(res => {
            message.success(res.data.message);
            fetchUserList();
        })
        .catch(err => {
            message.error(err.response.data.message);
        })
    }

    React.useEffect(() => {
        setNewUser({
            ...newUser,
            project_code: projectID
        });
    }, [projectID])

    React.useEffect(() => {
        fetchUserList();
    }, [])

    return (
        <div className="group-add-user">
            <div>
                <UnorderedListOutlined />
                <label className="title">USER LIST</label>
            </div>
            <div>
                <Table columns={columns} dataSource={users}/>
            </div>
        </div>
    )
}
export default ViewProject_MembersComponent;