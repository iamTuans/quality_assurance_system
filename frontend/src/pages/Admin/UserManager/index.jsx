import React, { useState } from "react";
import "./index.css";

function UserManager() {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {

    }

    React.useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div>AAA</div>
    )
}


export default UserManager;