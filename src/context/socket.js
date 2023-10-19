import React, { useRef, useEffect } from 'react';
import io from "socket.io-client";

 
const URL = 'http://localhost:3030'
// process.env.REACT_APP_SOCKET_URL

export const SocketContext = React.createContext()

function SocketHook  (){
    const Socket = useRef();

    useEffect(() => {
        Socket.current = io("http://localhost:3030");
    }, [])

    // socket.corrent = io(URL, { transports: ['websocket'] });
    return { Socket };

}

export default SocketHook
