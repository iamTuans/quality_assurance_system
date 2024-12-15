import React from "react";
import configs from "../../../.configs";
import axios from "axios";
import moment from 'moment';

import "./index.css";

import { Input, Button, Table, Tag, message } from "antd";

import {
    HistoryOutlined
} from "@ant-design/icons";

import Layout from "../../../components/Layout";
import { useNavigate } from "react-router-dom";

function HomePM() {

    const [projects, setProjects] = React.useState([]);

    const [projectKeyword, setProjectKeyword] = React.useState(null);

    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const [user, setUser] = React.useState(null);

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

    React.useEffect(() => {
        fetchProjects();
    }, [])

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem("auth"));
        setUser(user);
    });

    return (
        <Layout>
            <div className="group-info-project">
                <div style={{ 
                    fontWeight: 'bold',
                    fontSize: '20px',
                    display: 'flex',
                    gap: '10px'
                    }}>
                    Hello,  
                    <div>
                        {user?.full_name} !
                    </div>
                </div>

                <label>
                    Welcome to Project Management System. Let's get started managing your site.
                </label>
            </div>

            <div className="group-info-project">
                <div>
                    <HistoryOutlined />
                    <label className="title">HISTORY</label>
                </div>
                <div>
                    bbbb
                </div>
            </div>
        </Layout>
    )
}


export default HomePM;