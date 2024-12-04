import './index.css';
import { useNavigate } from 'react-router-dom';

function Error() {

    const navigate = useNavigate();

    return (
        <div id="notfound">
            <div className="notfound">
                <div className="notfound-404">
                    <h1>404</h1>
                </div>
                <h2>We are sorry, Page not found!</h2>
                <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                <div className='back' onClick={() => navigate('/')}>Back To Homepage</div>
            </div>
        </div>
    )
}

export default Error;