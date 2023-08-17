import React ,{useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signUpUser } from '../../store/slices/userSlice'
import { useNavigate } from "react-router-dom";
import Close from '../../Assets/close.svg'

function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const credentialsInitialState = {
        email: 'harel@1234.com',
        username: '',
        password: '1234'
    };

    const [credentials, setCredentials] = React.useState(credentialsInitialState);

    const { loggedInUser } = useSelector((state) => state.user); // Replace 'state.loggedInUser' with your actual state slice containing the logged-in user
    const { isLogin } = useSelector((state) => state.user); // Replace 'state.loggedInUser' with your actual state slice containing the logged-in user
    const { isSignup } = useSelector((state) => state.user); // Replace 'state.loggedInUser' with your actual state slice containing the logged-in user

    useEffect(() => {
        if (isLogin) {;
            navigate("/")
        }
    }, [isLogin]);

    const handleSignup = () => {
        dispatch(signUpUser(credentials));  
    };

    const handleClose = () => {
        navigate("/")
    };

    return (
        <section className="signup-user">
            {!loggedInUser && (
                <div className="header-login">
                    <button className="close" onClick={handleClose}>
                       <img src={Close} />
                    </button>
                    <h2>Signup</h2>
                </div>
            )}
            <div className="checkLogin">
                <form onKeyUp={(event) => event.key === 'Enter' && handleSignup()}>
                    <div className="rub">
                        <span className="req">*</span>
                        <input
                            type="email"
                            value={credentials.email}
                            onChange={(e) =>
                                setCredentials({ ...credentials, email: e.target.value })
                            }
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className="rub">
                        <span className="req">*</span>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) =>
                                setCredentials({ ...credentials, username: e.target.value })
                            }
                            placeholder="Username"
                            required
                        />
                    </div>

                    <div className="rub">
                        <span className="req">*</span>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) =>
                                setCredentials({ ...credentials, password: e.target.value })
                            }
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button type="button" className={'submit-button'}onClick={handleSignup}>
                        Signup
                    </button>
                    <br />
                    <p className="err">
                        <span>*</span> - this is a required field
                    </p>
                </form>
            </div>
        </section>
    );
}

export default Signup;
