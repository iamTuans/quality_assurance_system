import React from "react";
import "./index.css"
import axios from "axios";
import configs from "../../../.configs";
import moment from "moment";

import { Input, Button, Table, Tag, Select, message } from "antd";
import {
    SearchOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined
} from '@ant-design/icons';

import Layout from "../../../components/Layout";

const roles = [
    // { label: 'Admin', value: 'admin' },
    { label: 'PM', value: 'pm' },
    { label: 'User', value: 'user' }
]

function UserManager() {

    const [users, setUsers] = React.useState([]);

    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const [projectKeyword, setProjectKeyword] = React.useState(null);

    const [loading, setLoading] = React.useState(false);

    const searchByKeyword = async () => {
        setLoading(true);
        if (!projectKeyword) {
            fetchUsers();
        } else {
            await axios.post(`${configs.API_URL}/general/search-user`, {
                keyword: projectKeyword
            }, {
                headers: {
                    Authorization: localStorage.getItem("token") || "token"
                }
            })
                .then(res => {
                    message.success(`Match ${res.data.users.length} result(s)`); //thong bao ra man hinh message
                    const usersBuilded = res.data.users.map(user => {
                        return {
                            key: user._id,
                            username: user.username,
                            name: user.name || "",
                            role: user.role,
                            createdAt: user.createdAt
                        }
                    });
                    setUsers(usersBuilded);
                })
                .catch(err => {
                    message.error("Something went wrong!");
                })
        }
        setLoading(false);
    }

    const createUser = async () => {
        setLoading(true);
        if (!username || !password) {
            alert("Please fill all fields!");
            return;
        }
        await axios.post(`${configs.API_URL}/admin/add-user`, {
            username,
            password
        }, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                message.success(res.data.message);
                fetchUsers();
            })
            .catch(err => {
                message.error("Something went wrong!");
            })
        setLoading(false);
    }

    const fetchUsers = async () => {
        setLoading(true);
        await axios.get(`${configs.API_URL}/admin/get-users`, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                const usersBuilded = res.data.users.map(user => {
                    return {
                        key: user._id,
                        username: user.username,
                        name: user.name || "",
                        role: user.role,
                        createdAt: user.createdAt
                    }
                });
                setUsers(usersBuilded);
            })
            .catch(err => {
                alert("Something went wrong!")
            })
        setLoading(false);
    }

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
            title: 'Create Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: date => {
                return moment(date).format("DD-MM-YYYY")
            }
        },
        {
            title: 'Action',
            dataIndex: 'role',
            key: 'action',
            render: (role, user) => {
                return <Select
                    options={roles}
                    style={{ width: "100px" }}
                    defaultValue={role}
                    onChange={(newRole) => changeRole(newRole, user.username)}
                />
            }
        }
    ]

    const changeRole = async (newRole, username) => {
        await axios.post(`${configs.API_URL}/admin/modify-role`, {
            username, role: newRole
        }, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
        .then(res => {
            message.success(res.data.message);
            fetchUsers();
        })
        .catch(err => {
            message.error(err.response.data.message);
        })
    }

    React.useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <Layout>
            <div className="group-create-user">
                <div>
                    <SearchOutlined style={{ fontSize: '15px' }} />
                    <label className="title">SEARCH</label>
                </div>
                <div className="search-user">
                    <Input placeholder="Enter Key Word" size="large" onChange={(e) => setProjectKeyword(e.target.value)} />
                    <Button type="primary" size="large" onClick={searchByKeyword} >Search</Button>
                </div>
            </div>
            <div className="group-create-user">
                <div>
                    <PlusCircleOutlined />
                    <label className="title">CREATE A USER</label>
                </div>
                <div className="create-user">
                    <Input placeholder="Username" size="large" onChange={(e) => setUsername(e.target.value)} />
                    <Input placeholder="Default Password" size="large" onChange={(e) => setPassword(e.target.value)} />
                    <Button type="primary" size="large" onClick={() => createUser()}>Create</Button>
                </div>
            </div>
            <div className="group-create-user">
                <div>
                    <UnorderedListOutlined />
                    <label className="title">USER LIST</label>
                </div>
                <div>
                    <Table columns={columns} dataSource={users} pagination loading={loading} />
                </div>
            </div>
        </Layout>
    )
}

export default UserManager;