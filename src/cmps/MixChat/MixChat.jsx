import React, { useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SocketContext } from '../../context/socket';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    generatePath,
    useLocation,
    useNavigate,
    useSearchParams
} from "react-router-dom";
 
import Send from '../../Assets/send.svg'
import Trash from '../../Assets/trash.svg'

function MixChat({ }) {
    const [searchParams, setSearchParams] = useSearchParams();

    const mixId = searchParams.get('mixId');
    const { loggedInUser } = useSelector((state) => state.user);
    const socket = useContext(SocketContext);
    const { currSong } = useSelector(state => state.mixs);
    const [msg, setMsg] = useState({
        _id: null,
        name: null,
        replyToMsg: null,
        txt: '',
        gif: '',
        isReply: false,
    });
    const [msgsHistory, setMsgsHistory] = useState([]);
    const [msgs, setMsgs] = useState([]);
    const [users, setUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const chatEmojis = ['🤙', '😎', '👍', '😂', '👻', '🕺', '💃', '🤩', '🥳', '👽', '🤖'];
    const gifs = [
        "https://www.icegif.com/wp-content/uploads/dancing-icegif-3.gif",
        'https://media0.giphy.com/media/Qz5jqYCH9l5t4Dz1Di/giphy.gif',
        // ... (other gifs)
    ];

    useEffect(() => {
        socket.current.emit('join room', mixId);
    }, [])

    useEffect(() => {
        socket.current.on('chat message', message => {
            setMsgs(oldArray => [...oldArray, message]);
        })

        socket.current.on('type msg', isTyping => {
            setIsTyping(true);
        })

        socket.current.on('stop type msg', isTyping => {
            setIsTyping(false);
        })

        socket.current.on('message history', messages => {
            messages.filter(msg => {
                if (msg.roomId === mixId) {
                    setMsgsHistory(oldArray => [...oldArray, msg.msg])
                }
            })
        })

        socket.current.on('user joined', username => {
            setMsgs(oldArray => [...oldArray, username]);
        })

        socket.current.on('getCount', totalConnected => {
            setUsers(totalConnected);
        })

        socket.current.on('clear-all-chat', () => {
            setMsgs([]);
            setMsgsHistory([]);
        })

        return () => {
            // Cleanup code here
        };
    }, []);

    const sendMsg = (event) => {
        event.preventDefault(); // 👈️ prevent page refresh
        (loggedInUser) ? msg.name = loggedInUser.username : msg.name = 'Guest';
        msg._id = _makeId();

        socket.current.emit('send message', {
            msg: msg,
            roomId: mixId,
        });

        setMsg({
            _id: null,
            name: '',
            replyToMsg: null,
            txt: '',
            gif: '',
            isReply: false,
        });

        msgs.map((msg) => (msg.isReply = false));
    };
    
    const onIsReply = (msgID) => {
        const msgsCopy = [...msgs] 
        msgsCopy.map(msg => msg.isReply = false)
        setMsgs(msgsCopy)

        let msgIndex = msgsCopy.findIndex(msg => msg._id === msgID)
        msgsCopy[msgIndex].isReply = !msgsCopy[msgIndex].isReply
        setMsg((oldState) => ({...oldState, replyToMsg:msgsCopy[msgIndex].txt}))
    }

    const _makeId = (length = 9) => {
        let txt = "_idMsg";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < length; i++) {
            txt += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return txt;
    };

    const isTypingNow = () => {
        console.log('is typing')
        socket.current.emit('is typing', isTyping);
        setIsTyping(true);
    };
 
    const isNotTypingNow = () => {
        socket.current.emit('is not typing', isTyping);
        setIsTyping(false);
    };

    const clearChat = (event) => {
        event.preventDefault(); // 👈️ prevent page refresh
        setMsgs([]);
        setMsgsHistory([]);
        socket.current.emit('clear chat');
    };

    return (
        <section className="chat-app">
            <div className="now-playing">
                {currSong && <p><span> Now Playing - </span>{currSong.title}</p>}
            </div>

            <div className="chat-msgs">
                <ul>
                    {msgsHistory.map((mesg, idx) => (
                        <li key={idx + mesg}>
                            {mesg.txt && <p className="msg">{mesg.name}: {mesg.txt}</p>}
                            {mesg.gif && (
                                <div>
                                    {mesg.name}:
                                    <img src={mesg.gif} className="gif" alt="" />
                                </div>
                            )}
                        </li>
                    ))}
                    {msgs.map((mesg, idx) => (
                        <li key={idx}>
                            {mesg.replyToMsg && <p className="reply-to">Reply to : "{mesg.replyToMsg}"</p>}
                            {mesg.txt && <p className="msg">{mesg.name}: {mesg.txt}</p>}
                            {mesg.gif && (
                                <div>
                                    {mesg.name}:
                                    <img src={mesg.gif} className="gif" alt="" />
                                </div>
                            )}
                            <button
                                className={`reply-button ${mesg.isReply ? 'active' : ''}`}
                                onClick={() => onIsReply(mesg._id)}
                            >
                                <img className="reply-img" src="https://res.cloudinary.com/hw-projects/image/upload/v1643232966/appmixes/reply-solid.png" alt="" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="chat-form raised">
                <p className="some-typing">{isTyping && 'Someone typing...'}</p>
                <form onSubmit={sendMsg}>
                    <input
                        type="text"
                        value={msg.txt}
                        onChange={(e) => setMsg({ ...msg, txt: e.target.value })}
                        onKeyDown={isTypingNow}
                        onKeyUp={isNotTypingNow}
                        placeholder="Share your thoughts..."
                    />
                    <button type="submit"><i className="far fa-paper-plane"></i></button>
                    <select
                        name="emojis"
                        className="emojis"
                        value={msg.txt}
                        onChange={(e) => setMsg({ ...msg, txt: e.target.value })}
                    >
                        <option value={chatEmojis[1]} disabled hidden>{chatEmojis[1]}</option>
                        {chatEmojis.map((emoji, index) => (
                            <option key={emoji} value={emoji}>{emoji}</option>
                        ))}
                    </select>
                    <select
                        name="gifs"
                        className="gif-select"
                        value={msg.gif}
                        onChange={(e) => {
                            setMsg({ ...msg, gif: e.target.value });
                            sendMsg();
                        }}
                    >
                        <option value={chatEmojis[1]} disabled hidden className="gif-option">GIF</option>
                        {gifs.map((gif, index) => (
                            <option key={gif} value={gif}>GIF#{index}</option>
                        ))}
                    </select>
                    <button onClick={clearChat}><img src={Trash} /></button>
                    <button onClick={sendMsg}><img src={Send} /></button>
                </form>
            </div>
        </section>
    );
}
export default MixChat;
