import React from "react";
import "./index.css"
import axios from "axios";
import configs from "../../../.configs";
import moment from "moment";
import { Input, Button, Table, Select, Tag } from "antd";

function UserManager() {

    const [users, setUsers] = React.useState([]);
    

    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const createUser = async () => {
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
            alert("User created successfully!");
            fetchUsers();
        })
        .catch(err => {
            alert("Something went wrong!")
        })
    }

    const fetchUsers = async () => {
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
        }
    ]

    React.useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px"
            }}>
                <Input placeholder="Username" size="large" onChange={(e) => setUsername(e.target.value)} />
                <Input placeholder="Default Password" size="large" onChange={(e) => setPassword(e.target.value)} />
                <Button type="primary" size="large" onClick={() => createUser()}>Create</Button>
            </div>
            <div>
                <Table columns={columns} dataSource={users} pagination={
                    {
                        pageSize: 15
                    }
                }/>
            </div>
        </div>
    )
}

export default UserManager;