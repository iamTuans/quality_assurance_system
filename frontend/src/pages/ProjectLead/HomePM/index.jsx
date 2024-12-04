import React from "react";
import configs from "../../../.configs";
import axios from "axios";
import moment from 'moment';

import "./index.css";

import { Input, Button, Table, Tag, message } from "antd";

import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

function HomePM() {

    const [projects, setProjects] = React.useState([]);

    const [projectKeyword, setProjectKeyword] = React.useState(null);

    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

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
                    <Button type="primary" onClick={() => navigate(`/pm/project/edit/${code}`)} size="large"> View </Button>
                )
            }
        }
    ]

    React.useEffect(() => {
        fetchProjects();
    }, [])

    return (
        <Layout>
            <div className="group-info-project">

                aaa
                {/* <div>
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
                </div> */}
            </div>
        </Layout>
    )
}


export default HomePM;