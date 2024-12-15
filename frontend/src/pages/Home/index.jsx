import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    React.useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (!auth) {
            navigate('/login');
        }
        if (auth.role === 'admin') {
            navigate('/admin');
        }
        if (auth.role === 'pm') {
            navigate('/pm');
        }
        if (auth.role === 'user') {
            navigate('/user');
        }
    }, [JSON.parse(localStorage.getItem('auth'))]);

    return null;
}

export default Home;