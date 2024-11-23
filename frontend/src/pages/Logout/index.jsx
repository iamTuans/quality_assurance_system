import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        navigate('/login');
    }

    useEffect(() => {
        logout();
    }, [])


    return (
        <div>
            Logging out..
        </div>
    );
}

export default Logout;