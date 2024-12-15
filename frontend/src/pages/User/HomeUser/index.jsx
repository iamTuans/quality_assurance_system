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
    const [loading, setLoading] = React.useState(false);
    const [actions, setActions] = React.useState([]);
    const [user, setUser] = React.useState(null);

    const fetchActions = async () => {
        await axios.get(`${configs.API_URL}/general/get-actions?project_code=`, {
            headers: {
                Authorization: localStorage.getItem("token") || 'token'
            }
        })
            .then(res => {
                const buildedActions = [];
                if (res.data.actions) {
                    res.data.actions.forEach(action => {
                        buildedActions.push({
                            ...action,
                            createdAt: moment(action.createdAt).format('DD/MM/YYYY'),
                        });
                    });
                    buildedActions.reverse();
                }
                setActions(buildedActions);
            })
            .catch(err => {

            })
    }

    React.useEffect(() => {
        const user = JSON.parse(localStorage.getItem("auth"));
        setUser(user);
        fetchActions();
    }, [])

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
                    {actions.map((action, index) => {
                        return (
                            <div key={index}>
                                <p>{action?.action_name}</p>
                                <p>{action?.createdAt}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Layout>
    )
}


export default HomePM;