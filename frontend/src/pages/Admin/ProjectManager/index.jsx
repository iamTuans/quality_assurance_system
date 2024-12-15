import React from "react";
import configs from "../../../.configs";
import axios from "axios";
import moment from 'moment';
import "./index.css";

import { Input, Button, Table, Select, Tag, Menu, message } from "antd";
import {
    HomeOutlined,
    CopyOutlined,
    AppstoreOutlined,
    SettingOutlined,
    SearchOutlined,
    UnorderedListOutlined,
    PlusCircleOutlined
} from "@ant-design/icons";
import Layout from "../../../components/Layout";

function ProjectManager() {

    const [projects, setProjects] = React.useState([]);

    const [pms, setPms] = React.useState([]);

    const [selectedPm, setSelectedPm] = React.useState(null);
    const [projectCode, setProjectCode] = React.useState(null);

    const [projectKeyword, setProjectKeyword] = React.useState(null);

    const [loading, setLoading] = React.useState(false);

    const searchByKeyword = async () => {
        setLoading(true);
        if (!projectKeyword) {
            fetchProjects();
        } else {
            await axios.post(`${configs.API_URL}/general/search-project`, {
                keyword: projectKeyword
            }, {
                headers: {
                    Authorization: localStorage.getItem("token") || "token"
                }
            })
                .then(res => {
                    message.success(`Match ${res.data.users.length} result(s)`);
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
                    message.error("Something went wrong!");
                })
        }
        setLoading(false);
    }

    const createProject = async () => {
        setLoading(true);
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
                message.success(res.data.message);
                fetchProjects();
            })
            .catch(err => {
                alert("Something went wrong!")
            })
        setLoading(false);
    }

    const fetchProjects = async () => {
        setLoading(true);
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
        setLoading(false);
    }

    const fetchPms = async () => {
        setLoading(true);
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
        setLoading(false);
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
            key: "start_date",
            render: (text) => (text ? moment(text, "YYYY-MM-DD").format("DD/MM/YYYY") : null)
        },
        {
            title: "End Date",
            dataIndex: "end_date",
            key: "end_date",
            render: (text) => (text ? moment(text, "YYYY-MM-DD").format("DD/MM/YYYY") : null)
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
            icon: <HomeOutlined />,
            onClick: () => {
                window.location.href = '/';
            }
        },
        {
            key: 'sub1',
            label: 'Project Manager',
            icon: <CopyOutlined />,
            children: [
                {
                    key: 'create-a-project',
                    label: 'Create a Project',
                    onClick: () => {
                        window.location.href = '/admin/project-manager';
                    }
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
                    onClick: () => {
                        window.location.href = '/admin/user-manager';
                    }
                },
            ],
        },
        {
            key: 'sub4',
            label: 'Setting',
            icon: <SettingOutlined />,
            children: [
                {
                    key: 'log-out',
                    label: 'Loh Out',
                    onClick: () => {
                        window.location.href = '/logout';
                    }
                },
            ],
        },
    ];

    React.useEffect(() => {
        fetchProjects();
        fetchPms();
    }, [])

    return (
        <Layout>
            <div className="group-create-project">
                <div>
                    <SearchOutlined style={{ fontSize: '15px' }} />
                    <label className="title">SEARCH</label>
                </div>
                <div className="search-project">
                    <Input placeholder="Enter Key Word" size="large" onChange={(e) => setProjectKeyword(e.target.value)} />
                    <Button type="primary" size="large" onClick={searchByKeyword}>Search</Button>
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
                    <Table dataSource={projects} columns={columns} pagination loading={loading} />
                </div>
            </div>
        </Layout>
    )
}


export default ProjectManager;