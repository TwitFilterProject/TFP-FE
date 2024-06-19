import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('192.168.0.100:8080', {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: false,
})
// const socket = io('http://localhost:8080', {
//     transports: ['websocket'],
//     autoConnect: false,
//     reconnection: false,
// })

const SystemMessage = {
    id: 1,
    body: "채팅방에 들어오신 것을 환영합니다.",
}

const Chat = () => {
    const nav = useNavigate();

    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([SystemMessage]);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            console.log("socket connected")
        })
        socket.on("disconnect", () => {
            console.log("socket disconnected")
        })
        
        socket.on("chat", (newMsg) => {
            console.log("new message: ", newMsg);
            setMessages(prevMsg => [...prevMsg, newMsg]);
        });

        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("chat")
        }
    }, [])

    const handleSendMsg = (e) => {
        // if(e.key !== 'Enter' || inputValue.trim().length == 0) return;
        // if(e.key === "Enter" && inputValue.trim().length > 0) {
            console.log(inputValue)
            socket.emit("chat", {body: inputValue});
            setInputValue("")
        // }
    }

    const handleLogout = () => {
        socket.disconnect();
        nav("/");
    }

    return (
        <>
            <button onClick={handleLogout}>Logout</button>
            <div>
                {messages.map((msg, idx) => {
                    return (
                        <div key={idx}>
                            {msg.body}
                        </div>
                    )
                })}
            </div>
            <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                // onKeyDown={handleSendMsg}
            />
            <button onClick={handleSendMsg}>send</button>
        </>
    )
};

export default Chat;
