import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/slices/userSlice'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    generatePath,
    useLocation,
    useNavigate,
    useSearchParams
} from "react-router-dom";
import Close from '../../Assets/close.svg'

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [credentials, setCredentials] = useState({
        email: 'harel@1234.com',
        password: '1234'
    });
    const [isError, setIsError] = useState(false);

    const { loggedInUser } = useSelector((state) => state.user);

    const handleLogin = async () => {
        try {
            await dispatch(loginUser(credentials))
            navigate("/")
        } catch (err) {
            setIsError(true);
        }
    };

    const handleClose = () => {
        navigate("/")
    };

    return (
        <section className="login-user">
            {!loggedInUser && (
                <div className="header-login">
                    <button className="close" onClick={handleClose}>
                       <img src={Close} />
                    </button>
                    <h2>login</h2>
                </div>
            )}
            <div className="checkLogin">
                <form onKeyUp={(event) => event.key === 'Enter' && handleLogin}>
                    <input
                        type="text"
                        placeholder="User name"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                    <button type="button" className="submit-button" onClick={handleLogin}>
                        Login
                    </button>
                    {isError && <span className="err">Email or Password incorrect</span>}
                </form>
            </div>
        </section>
    );
}

export default Login;
