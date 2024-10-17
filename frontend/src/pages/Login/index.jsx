import React from 'react'
import './index.css'

function Login() {

    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);

    const handleLogin = () => {
        alert(`Username: ${username}, Password: ${password}`); //thong bao ra man hinh
    }

    return(
        <div className="login-container">
            <div className="login-panal">
                <div className="login-panal-title">
                    Wellcome
                </div>
                <div className="login-panal-form">
                    <div className='panal-form-items'>
                        <div className='form_label'>Username:</div>
                        <input type="text" placeholder="Enter your Email" onChange={(event) => { //onChange ghi nhan su thay doi khi nhap thong tin
                            const new_username = event.target.value;
                            setUsername(new_username);
                        }}/>
                    </div>
                    <div className='panal-form-items'>
                        <div className='form_label'>Password:</div>
                        <input type="password" placeholder="Enter your Password" onChange={(event) => {
                            const new_password = event.target.value;
                            setPassword(new_password);
                        }}/>
                    </div>
                    <div>
                        <button className='login-buton'onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;