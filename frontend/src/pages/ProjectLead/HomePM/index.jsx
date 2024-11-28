import React from "react";
import configs from "../../../.configs";
import axios from "axios";
import moment from 'moment';

import "./index.css";

import { Input, Button, Table, Tag, Menu, message } from "antd";
import {
    HomeOutlined,
    AppstoreAddOutlined,
    FormOutlined,
    SettingOutlined,
    SearchOutlined,
    UnorderedListOutlined,
} from "@ant-design/icons";

function HomePM() {

    const [projects, setProjects] = React.useState([]);

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
                    message.success(res.data.message);
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
        setLoading(false);
    }

    const fetchProjects = async () => {
        setLoading(true);
        await axios.get(`${configs.API_URL}/pm/get-projects`, {
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
        },
        {
            title: "Action",
            key: "Action",
            render: (_, { code }) => {
                return (
                    <Button type="primary" onClick={() => window.location.href = `/pm/project/edit/${code}`} size="large" danger> Edit </Button>
                )
            }
        }
    ]

    const items = [
        {
            key: 'sub0',
            label: 'Home',
            icon: <HomeOutlined />,
            onClick: () => {
                window.location.href = '/pm/home';
            }
        },

        {
            key: 'sub2',
            label: 'Create',
            icon: <AppstoreAddOutlined />,
            children: [
                {
                    key: 'create-task',
                    label: 'Create Task',
                },
                {
                    key: 'create-doc',
                    label: 'Create Document',
                    onClick: () => {
                        window.location.href = '/create-document';
                    }
                },
                {
                    key: 'create-bug',
                    label: 'Create Defect',
                },
            ],
        },

        {
            key: 'sub1',
            label: 'User Information',
            icon: <FormOutlined />,
            children: [
                {
                    key: 'view',
                    label: 'View Information',
                },
                {
                    key: 'change-info',
                    label: 'Change Information',
                    onClick: () => {
                        window.location.href = '/pm/change-info';
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
                    key: 'sub2',
                    label: 'Change Password',
                },
                {
                    key: 'log-out',
                    label: 'Log Out',
                    onClick: () => {
                        window.location.href = '/logout';
                    },
                },
            ],
        }
    ];

    React.useEffect(() => {
        fetchProjects();
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
                <div className="group-info-project">
                    <div>
                        <SearchOutlined style={{ fontSize: '15px' }} />
                        <label className="title">SEARCH</label>
                    </div>
                    <div className="search-project">
                        <Input placeholder="Enter Key Word" size="large" onChange={(e) => setProjectKeyword(e.target.value)} />
                        <Button type="primary" size="large" onClick={searchByKeyword}>Search</Button>
                    </div>
                </div>
                <div className="group-info-project">
                    <div>
                        <UnorderedListOutlined />
                        <label className="title">PROJECT LIST</label>
                    </div>
                    <div>
                        <Table dataSource={projects} columns={columns} pagination loading={loading}></Table>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default HomePM;