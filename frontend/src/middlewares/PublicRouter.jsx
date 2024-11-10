import React from "react";
import axios from "axios";
import configs from "../.configs";
import { useNavigate } from "react-router-dom";

function PublicRouter({ children }) {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = React.useState(true);

    const verifyToken = () => {
        if(localStorage.getItem("token") && localStorage.getItem("auth")) {
            setIsAuthenticated(true);
            navigate("/");
        } else {
            setIsAuthenticated(false);
        }
    }

    React.useEffect(() => {
        verifyToken();
    }, []);

    if (isAuthenticated) {
        return null;
    } else {
        return children;
    }
}

export default PublicRouter;