import React from "react";
import axios from "axios";
import configs from "../.configs";
import { useNavigate } from "react-router-dom";

function PrivateRouter({ children, enabled }) {

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    const removeToken = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("auth");
        setIsAuthenticated(false);
        navigate("/login");
    }

    const verifyToken = async () => {
        await axios.post(`${configs.API_URL}/auth/verify`, {

        }, {
            headers: {
                Authorization: localStorage.getItem("token") || "token"
            }
        })
            .then(res => {
                const role = res.data.auth.role;
                if (enabled.includes(role)) { //kiem tra role
                    localStorage.setItem("auth", JSON.stringify(res.data.auth)); //kiem tra va doi Json sang String
                    setIsAuthenticated(true);
                } else {
                    removeToken();
                }
            })
            .catch(_ => {
                removeToken();
            })
    }

    React.useEffect(() => { // hàm này ưu tiên chạy đầu tiên trong chường trình
        verifyToken();
    }, []);

    if (isAuthenticated) {
        return children;
    } else {
        return null;
    }
}

export default PrivateRouter;