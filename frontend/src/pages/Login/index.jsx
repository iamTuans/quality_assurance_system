import React from 'react'
import './index.css'
import axios from "axios";
import configs from "../../.configs";
import { useNavigate } from 'react-router-dom'; // quản lý việc navigate sang màn hình khác

function Login() {
    
    const navigate = useNavigate();
    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const handleLogin = async() => {
        await axios.post(`${configs.API_URL}/auth/login`, {
            username, password
        })
        .then(res => { //khong co loi chay dong then
            alert(res.data.message);
            localStorage.setItem("token", res.data.token);
            navigate("/"); //sau khi đăng nhập thì navigave sang màn hình home
        })
        .catch(err => {
            console.log(err);
            alert("Login failed with error: " + err.response.data.message);
        }) //co loi chay dong catch

        // alert(`Username: ${username}, Password: ${password}`); //thong bao ra man hinh
    }

    return(
        <div className="login-container">
            <div className="login-panal">
                <div className="login-panal-title">
                    Wellcome
                </div>
                <div className="login-panal-form">
                    <div className='panal-form-items'>
                        <label className='form_label'>Username:</label>
                        <input className='button-text' type="text" placeholder="Enter your Username" onChange={(event) => { //onChange ghi nhan su thay doi khi nhap thong tin
                            const new_username = event.target.value;
                            setUsername(new_username);
                        }}/>
                    </div>
                    <div className='panal-form-items'>
                        <label className='form_label'>Password:</label>
                        <input className='button-text' type="password" placeholder="Enter your Password" onChange={(event) => {
                            const new_password = event.target.value;
                            setPassword(new_password);
                        }}/>
                    </div>
                    <div className='login-hint'>
                    Not a member? To request an account, please contact your administrators.
                    </div>
                    <div className='login-button'>
                        <button className='button-text' onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;