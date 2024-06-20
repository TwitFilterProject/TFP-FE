import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import { Container, PostProfile, TopSection, LogoContainer, Logo, Header, SearchBar, SearchInput, SearchIcon, MainContent, Navigator, NavItem, NavIcon, MainSection } from './Main';

import logo from '../Images/logo.png';
import cleansLogo from '../Images/cleans-logo.png';
import home from '../Images/home.png';
import chat from '../Images/chat.png';
import searchIcon from '../Images/search.png';
import profile from '../Images/profile-user.png';

const socket = io('10.101.6.69:8080', {
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
    sender: "관리자",
    body: "채팅방에 들어오신 것을 환영합니다.",
}

const Chat = () => {
    const nav = useNavigate();

    const [search, setSearch] = useState("");
    const [posts, setPost] = useState(null);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([SystemMessage]);

    const onChange = (e) => {
        setSearch(e.target.value);
    };

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
            socket.emit("chat", {sender: '유저', body: inputValue});
            setInputValue("")
        // }
    }

    const handleLogout = () => {
        socket.disconnect();
        nav("/");
    }

    return (
        <Container>
            <TopSection>
                <LogoContainer>
                    <Logo src={logo} alt="logo"/>
                </LogoContainer>

                <Header>
                    <SearchBar>
                        <SearchIcon src={searchIcon} alt="search"/>
                        <SearchInput
                            type="text"
                            value={search}
                            onChange={onChange}
                            placeholder="Search"
                        />
                    </SearchBar>
                </Header>
            </TopSection>

            <MainContent>
                <Navigator>
                    <NavItem onClick={(() => {nav("/")})}>
                        <NavIcon  src={home} alt="home"/>
                        <span>Home</span>
                    </NavItem>
                    <NavItem onClick={() => {nav("/chat")}}>
                        <NavIcon src={chat} alt="chat"/>
                        <span>Chat</span>
                    </NavItem>
                    <NavItem>
                        <NavIcon src={profile} alt="profile"/>
                        <span>Profile</span>
                    </NavItem>
                </Navigator>

                {/* 채팅 섹션 */}
                <MainSection>

                <button onClick={handleLogout}>Logout</button>
                    <div>
                        {messages.map((msg, idx) => {
                            console.log(msg)
                            return (
                                <div key={idx}>
                                    <div>{msg.sender}</div>
                                    <div>{msg.body}</div>
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

                </MainSection>
            </MainContent>
        </Container>
    )
};

export default Chat;
