import React from "react";
import configs from "../../../.configs";
import axios from "axios";

import "./index.css";

import { Input, Button, Table, Select, Tag, Menu } from "antd";
import { HomeOutlined, MailOutlined, AppstoreOutlined, SettingOutlined, SearchOutlined, UnorderedListOutlined, PlusCircleOutlined } from '@ant-design/icons';

function ProjectManager() {

    const [projects, setProjects] = React.useState([]);

    const [pms, setPms] = React.useState([]);

    const [selectedPm, setSelectedPm] = React.useState(null);
    const [projectCode, setProjectCode] = React.useState(null);

    const createProject = async () => {
        if (!selectedPm || !projectCode) {
            alert("Please fill all fields!");
            return;
        }
        await axios.post(`${configs.API_URL}/admin/create-project`, {
            leader_username: selectedPm,
            project_code: projectCode
        }, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                alert("Project created successfully!");
                fetchProjects();
            })
            .catch(err => {
                alert("Something went wrong!")
            })
    }

    const fetchProjects = async () => {
        await axios.get(`${configs.API_URL}/admin/get-projects`, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                const buildedProjects = res.data.projects.map(project => {
                    return {
                        key: project._id,
                        code: project.code,
                        name: project.name || "",
                        leader: project.leader.username || "",
                        rank: project.rank || "",
                        category: project.category || "",
                        start_date: project.start_date || "",
                        end_date: project.end_date || "",
                        customer: project.customer || "",
                        status: project.status || "undefined"
                    }
                });
                setProjects(buildedProjects);
            })
            .catch(err => {
                alert("Something went wrong!")
            })
    }

    const fetchPms = async () => {
        await axios.get(`${configs.API_URL}/admin/get-users?role=pm`, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                const pmsBuilded = res.data.users.map(user => {
                    return {
                        label: user.name,
                        value: user.username
                    }
                })
                setPms(pmsBuilded);
            })
            .catch(err => {
                alert("Something went wrong!")
            })
    }

    const columns = [
        {
            title: "Project Code",
            dataIndex: "code",
            key: "code"
        },
        {
            title: "Project Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Rank",
            dataIndex: "rank",
            key: "rank"
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category"
        },
        {
            title: "Project Lead",
            dataIndex: "leader",
            key: "leader"
        },
        {
            title: "Start Date",
            dataIndex: "start_date",
            key: "start_date"
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date"
        },
        {
            title: "Customer",
            dataIndex: "customer",
            key: "customer"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (_, { status }) => {
                if (status === "open") {
                    return <Tag color="green">{status}</Tag>
                }
                if (status === "pending") {
                    return <Tag color="orange">{status}</Tag>
                }
                if (status === "close") {
                    return <Tag color="grey">{status}</Tag>
                }
                return <></>
            }
        }
    ]

    const items = [
        {
            key: 'sub0',
            label: 'Home',
            icon: <HomeOutlined />
        },
        {
            key: 'sub1',
            label: 'Project Manager',
            icon: <MailOutlined />,
            children: [
                {
                    key: 'create-a-project',
                    label: 'Create a Project',
                },
            ],
        },
        {
            key: 'sub2',
            label: 'User Manager',
            icon: <AppstoreOutlined />,
            children: [
                {
                    key: 'create-a-user',
                    label: 'Create a User',
                },
            ],
        },
        {
            key: 'sub4',
            label: 'Setting',
            icon: <SettingOutlined />,
            children: [
                {
                    key: 'sign-out',
                    label: 'Sign Out'
                },
            ],
        },
    ];

    React.useEffect(() => {
        fetchProjects();
        fetchPms();
    }, [])

    const onClick = (e) => {
        console.log('click ', e);
    };

    return (
        <div className="group">
            <div className="group-column-left">
                <Menu
                    onClick={onClick}
                    style={{ width: 256 }}
                    mode="inline"
                    items={items}
                />
            </div>
            <div className="group-column-right">
                <div className="group-create-project">
                    <div>
                        <SearchOutlined style={{ fontSize: '15px' }} />
                        <label className="title">SEARCH</label>
                    </div>
                    <div className="search-project">
                        <Input placeholder="Enter Key Word" size="large" />
                        <Button type="primary" size="large">Search</Button>
                    </div>
                </div>
                <div className="group-create-project">
                    <div>
                        <PlusCircleOutlined />
                        <label className="title">CREATE A PROJECT</label>
                    </div>
                    <div className="create-project">
                        <Input placeholder="Project Code" size="large" onChange={(e) => setProjectCode(e.target.value)} />
                        <Select placeholder="Project Lead" size="large" style={{ width: "300px" }} options={pms} onChange={(pm_username) => setSelectedPm(pm_username)} />
                        <Button type="primary" size="large" onClick={() => createProject()}>Create</Button>
                    </div>
                </div>
                <div className="group-create-project">
                    <div>
                        <UnorderedListOutlined />
                        <label className="title">PROJECT LIST</label>
                    </div>
                    <div>
                        <Table dataSource={projects} columns={columns} />
                    </div>
                </div>
            </div>
        </div>
    )
}


export default ProjectManager;