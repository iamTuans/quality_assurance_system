import React, { useState } from "react";
import configs from "../../../.configs";
import axios from "axios";
import moment from 'moment';

import "./index.css";

import { Input, Table, Tag, message, Tabs, Button, Select, DatePicker } from "antd";

// import {
//     SearchOutlined,
//     UnorderedListOutlined,
//     PlusCircleOutlined
// } from '@ant-design/icons';

import Layout from "../../../components/Layout";

// Components
import ViewProject_InformationComponent from './Components/Infomation';
import ViewProject_MembersComponent from './Components/Members';
import ViewProject_ResourcesComponent from './Components/Resources';
import ViewProject_SummaryComponent from "./Components/Summary";
import ViewProject_TaskComponent from "./Components/Tasks";

function Tasks() {

}

function ViewProject() {

    const items = [
        {
            key: '1',
            label: 'Summary',
            children: <ViewProject_SummaryComponent />
        },
        {
            key: '5',
            label: 'Tasks',
            children: <ViewProject_TaskComponent />
        },
        {
            key: '3',
            label: 'Resources',
            children: <ViewProject_ResourcesComponent />
        },
        {
            key: '2',
            label: 'Information',
            children: <ViewProject_InformationComponent />
        },
        {
            key: '4',
            label: 'Members',
            children: <ViewProject_MembersComponent />
        }
    ]

    return (
        <div>
            <Layout>
                <div className="group-info-project">
                    <div>
                        <Tabs
                            defaultActiveKey="1"
                            type="card"
                            size="large"
                            items={items}
                        />
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default ViewProject;