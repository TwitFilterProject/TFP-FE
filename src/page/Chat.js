import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import { Container, PostProfile, TopSection, LogoContainer, Logo, Header, SearchBar, SearchInput, SearchIcon, MainContent, Navigator, NavItem, NavIcon, MainSection } from './Main';

import styled from "styled-components";

import logo from '../Images/logo.png';
import cleansLogo from '../Images/cleans-logo.png';
import home from '../Images/home.png';
import chat from '../Images/chat.png';
import searchIcon from '../Images/search.png';
import profile from '../Images/profile-user.png';

// styled
const InputBox = styled.input`
    width: 300px; height: 30px;
    margin: 0 0 10px 0;
`
const SendBtn = styled.div`
    width: 120px; height: 30px;
    border-radius: 5px;
    background-color: skyblue;
    color: white;
    font-weight: bold;
    display: flex; justify-content: center; align-items: center;
    cursor: pointer;

    &:hover {
        transform: scale(102%);
    }
`

const UsersBox = styled.div`
    width: calc(100% - 800px); height: auto;
    border: 1px solid;
    box-sizing: border-box;
    display: flex;
`



const socket = io('http://localhost:8080', {
    transports: ['websocket'],
    autoConnect: false,
    reconnection: false,
})

const SystemMessage = {
    sender: "SookmyungCleans",
    body: "채팅방에 들어오신 것을 환영합니다.",
}

const Chat = () => {
    const nav = useNavigate();

    const [search, setSearch] = useState("");

    const [activate, setActivate] = useState(false);
    const [nickname, setNickname] = useState("");
    const [activateUser, setActivateUser] = useState([]);
    const [socketId, setSocketId] = useState("");

    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([SystemMessage]);

    const [isComposing, setIsComposing] = useState(false); // 한글 입력 상태


    const onChange = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        socket.on("connect", () => {
            console.log("socket connected:", socket.id, nickname);
            socket.emit("user", {id: socket.id, nickname: nickname});
            setActivate(true);
        })
        socket.on("disconnect", () => {
            console.log("socket disconnected")
        })
        
        socket.on("socketId", (id) => {
            console.log("new socketId: ", id);
            setSocketId(id);
        });
        socket.on("chat", (newMsg) => {
            console.log("new message: ", newMsg);
            setMessages(prevMsg => [...prevMsg, newMsg]);
        });
        socket.on("activated", (users) => {
            console.log("activated users: ", users);
            setActivateUser(users);
        });

        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("socketId")
            socket.off("chat")
            socket.off("activated")
        }
    }, [nickname])

    const connectSocket = () => {
        if(nickname.trim().length == 0) return;
        console.log(nickname);
        localStorage.setItem("nickname", nickname);
        socket.connect();
    }

    const handleSendMsg = () => {
        if(inputValue.trim().length == 0) return;
        const nick = localStorage.getItem("nickname");
        socket.emit("chat", {sender: nick, body: inputValue});
        setInputValue("")
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
                {!activate &&
                    <>
                    <InputBox
                        placeholder='닉네임을 입력해주세요.'
                        value={nickname}
                        onChange={((e) => setNickname(e.target.value))}
                        onKeyDown={((e) => {
                            if(e.key == 'Enter') connectSocket();
                        })}
                    />
                    <SendBtn onClick={connectSocket}>채팅 참가하기</SendBtn>
                    </>
                }
                {activate &&
                    <>
                    참여 중인 유저 목록
                    <UsersBox>
                        {activateUser.map((user, idx) => {
                            return (
                                <div key={idx}>{user.nickname} ({user.id}) / </div>
                            )
                        })}
                    </UsersBox>
                    <button onClick={handleLogout}>Logout</button>
                        <div>
                            {messages.map((msg, idx) => {
                                return (
                                    <div key={idx}>
                                        <div>{msg.sender}</div>
                                        <div>{msg.body}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <InputBox
                            type="text" 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)} 
                            placeholder="Enter your message"
                            disabled={!activate}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isComposing) {
                                    e.preventDefault();
                                    handleSendMsg();
                                }
                            }}
                            onCompositionStart={() => setIsComposing(true)} // 한글 입력 시작
                            onCompositionEnd={() => setIsComposing(false)} // 한글 입력 종료
                        />
                    <SendBtn onClick={handleSendMsg}>보내기</SendBtn>
                    </>
                }

                </MainSection>
            </MainContent>
        </Container>
    )
};

export default Chat;
