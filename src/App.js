import logo from './logo.svg';
import React, { useContext, useEffect, useRef } from 'react';
import './App.css';
import './styles/styles.scss'
import { useDispatch, useSelector } from 'react-redux';
import { getMix } from './store/slices/mixSlice'

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";

import MainHomeC from './cmps/MainHomeC/MainHomeC';
import Player from './cmps/Player/Player';
import Mixdetails from './cmps/MixDetails/MixDetails';
import Header from './cmps/Header/Header';
import Login from './cmps/Login/Login';
import Signup from './cmps/Signup/Signup';

import { socket, SocketContext } from './context/socket';
import io from "socket.io-client";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <MainHomeC />
        <Player />
      </div>
    ),
  },
  {
    path: "/mix",
    element: (
      <div>
        <Mixdetails />
        <Player />
      </div>
    ),
  },
  {
    path: "/mix:mixId",
    element: (
      <div>
        <Mixdetails />
        <Player />
      </div>
    ),
  },
  {
    path: "/login",
    element: <div>
      <Header />
      <Login />
    </div>,
  },
  {
    path: "/signup",
    element: <div>
      <Header />
      <Signup />
    </div>,
  },
]);


function App() {
  const dispatch = useDispatch();
  const socket = useRef();

  const connectionOptions = {
    transports: ["websocket"],
    autoConnect: true,
  };

  const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : 'http://localhost:3030'

  useEffect(() => {
    if (socket.current) return
    socket.current = io(BASE_URL);
    return () => {
      socket.current.off();
    }
  }, [])

  useEffect(() => {
    dispatch(getMix())
  }, [])

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <RouterProvider router={router} />
      </SocketContext.Provider>
    </div>
  );
}

export default App;
