import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import configs from '../../../../../.configs';
import moment from 'moment';

export default function ViewProject_SummaryComponent() {

    const [actions, setActions] = React.useState([]);
    const { projectID } = useParams();

    const fetchActions = async () => {
        await axios.get(`${configs.API_URL}/general/get-actions?project_code=${projectID}`, {
            headers: {
                Authorization: localStorage.getItem("token") || 'token'
            }
        })
        .then(res => {
            console.log(res.data);
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
            console.log(buildedActions);
            setActions(buildedActions);
        })
        .catch(err => {

        })
    }

    React.useEffect(() => {
        fetchActions();
    }, [projectID]);

    return (
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
    )
}