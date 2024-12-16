import React from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import configs from '../../../../../.configs'
import moment from 'moment';

import "./index.css";

import { Button, Table, Modal, Form, Input, Select, DatePicker, message } from "antd";

import {
    PlusOutlined,
} from "@ant-design/icons";

function ViewProject_TaskComponent() {

    const { projectID } = useParams();
    const fileInputRef = React.useRef(null);
    const [loading, setLoading] = React.useState(false);
    const [isOpenModal, setOpenModal] = React.useState(false);
    const [isOpenReviewModal, setOpenReviewModal] = React.useState(false);
    const [isOpenEditModal, setOpenEditModal] = React.useState(false);
    const [resources, setResources] = React.useState([]);
    const [state, setState] = React.useState(0);

    const [file, setFile] = React.useState(null);

    const changeState = () => {
        setState(prev => !prev);
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: 10,
          },
          {
            title: 'Hours',
            dataIndex: 'hours',
            key: 'hours',
            width: 10,
          },
          {
            title: '2024 (hiện năm)',
            children: [
                  {
                    title: 'December (hiện tháng)',
                    children: [
                      {
                        title: '1',
                        dataIndex: '1',
                        key: '1',
                        width: 100,
                      },
                      {
                        title: '2',
                        dataIndex: '2',
                        key: '2',
                        width: 100,
                      },
                      {
                        title: '3',
                        dataIndex: '3',
                        key: '3',
                        width: 100,
                      },
                        {
                        title: '4',
                        dataIndex: '4',
                        key: '4',
                        width: 100,
                        },
                    ],
                  },
            ],
          },
        ];



    React.useEffect(() => {

    }, [])

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };

    return (
        <>
        <Table columns={columns} dataSource={resources} />

        </>
    )
}

export default ViewProject_TaskComponent;