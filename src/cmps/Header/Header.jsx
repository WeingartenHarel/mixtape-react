import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'; // If you are using React Router for navigation
import { useSelector, useDispatch } from 'react-redux'; // Assuming you are using Redux for state management
import { loginUser, logOut } from '../../store/slices/userSlice'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  generatePath,
  useLocation,
  useNavigate,
  useSearchParams
} from "react-router-dom";
// import Navbar from '../components/Navbar'; // Replace with the actual path to your Navbar component
// Import other components as needed 

const AppHeader = () => {
  const { loggedInUser } = useSelector((state) => state.user);
  const { isLogin } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch an action or use any logic you need for setting signup state
    dispatch(logOut())

  };

  // to do
  const onSetSignup = () => {
    // Dispatch an action or use any logic you need for setting signup state
  };

  const onSetLogout = () => {
    // Dispatch an action or use any logic you need for handling logout
  };

  const handleOpen = (key, keyPath) => {
    // Implement any logic you need when the menu is opened
  };

  const handleClose = (key, keyPath) => {
    // Implement any logic you need when the menu is closed
  };


  return (
    <section>
      <div className="app-header">
        <div className={`logo`}>
          <Link to="/">
            <img
              className="reflect"
              src="https://res.cloudinary.com/hw-projects/image/upload/v1607170425/appmixes/logo_r_animated_v3_160x105.gif"
            />
          </Link>
          <Link to="/">
            <h2 className="brand-name">mixTape</h2>
          </Link>
        </div>
        <img
          className="imgroot"
          src="https://res.cloudinary.com/hw-projects/image/upload/v1607380891/appmixes/imgroot200x200.gif"
        />
        <nav className="main-nav">
          {!isLogin ? <Link to="/login">
            <h2 className="brand-name">Login</h2>
          </Link>
            : <h2 className="brand-name" onClick={handleLogout}>Logout</h2>}
          <Link to="/signup">
            <h2 className="brand-name">Signup</h2>
          </Link>
          {loggedInUser && <span>Hello: {loggedInUser.username}</span>}
        </nav>
      </div>
    </section>
  );
};

export default AppHeader;
