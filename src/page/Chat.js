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

// const InputBox = styled.input`
//     width: 100%;
//     padding: 10px;
//     margin-bottom: 10px;
//     border: 1px solid #e1e8ed;
//     border-radius: 20px;
//     font-size: 16px;
//     &:focus {
//         outline: none;
//         border-color: #1da1f2;
//     }
// `;

// const InputBox = styled.input`
//     width: 300px; height: 30px;
//     margin: 0 0 10px 0;
// `


// const SendBtn = styled.div`
//     width: 120px; height: 30px;
//     border-radius: 5px;
//     background-color: skyblue;
//     color: white;
//     font-weight: bold;
//     display: flex; justify-content: center; align-items: center;
//     cursor: pointer;

//     &:hover {
//         transform: scale(102%);
//     }
// `

// const UsersBox = styled.div`
//     width: calc(100% - 800px); height: auto;
//     border: 1px solid;
//     box-sizing: border-box;
//     display: flex;
// `

const StyledMainSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f8fa;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    height: 85vh;
    width: 100vw;
    box-sizing: border-box;
`;

const NicknameInputBox = styled.input`
    padding: 10px;
    border: 1px solid #e1e8ed;
    border-radius: 20px;
    font-size: 16px;
    &:focus {
        outline: none;
        border-color: #1da1f2;
    }
    margin-bottom: 10px; /* 닉네임 입력 input과 버튼 사이에 margin 추가 */
`;

const MessageInputBox = styled.input`
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #e1e8ed;
    border-radius: 20px;
    font-size: 16px;
    &:focus {
        outline: none;
        border-color: #1da1f2;
    }
`;

const SendBtn = styled.button`
    background-color: #1da1f2;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-left: 10px;
    &:hover {
        background-color: #0d95e8;
    }
`;

const InputContainer = styled.div`
    display: flex;
    width: 100%;
    margin-top: 5px;
    margin-bottom:5px;
`;

const UsersBox = styled.div`
    background-color: #fff;
    border: 1px solid #e1e8ed;
    border-radius: 10px;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    width: 100%;
    max-height: 200px;
    text-align: center;
`;

const MessageContainer = styled.div`
    background-color: #fff;
    border: 1px solid #e1e8ed;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 20px;
    width: 100%;
    height: calc(100vh - 300px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

const Message = styled.div`
    max-width: 60%;
    background-color: ${props => props.isMine ? '#1da1f2' : '#e1e8ed'};
    color: ${props => props.isMine ? '#fff' : '#000'};
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
    align-self: ${props => props.isMine ? 'flex-end' : 'flex-start'};
    &:nth-child(even) {
        background-color: ${props => props.isMine ? '#0d95e8' : '#cfd9de'};
    }
`;

const Sender = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
`;

const Body = styled.div`
    font-size: 14px;
    text-align: left;
`;

const LogoutButton = styled.button`
    background: linear-gradient(135deg, #ff4d4d, #ff1a1a);
    color: white;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(255, 77, 77, 0.4);
    transition: all 0.3s ease;

    &:hover {
        background: linear-gradient(135deg, #ff1a1a, #ff4d4d);
        box-shadow: 0 6px 8px rgba(255, 77, 77, 0.6);
        transform: translateY(-2px);
    }
`;




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

                <StyledMainSection>
        {!activate &&
            <>
                <NicknameInputBox
                    placeholder='닉네임을 입력해주세요.'
                    value={nickname}
                    onChange={((e) => setNickname(e.target.value))}
                    onKeyDown={((e) => {
                        if (e.key == 'Enter') connectSocket();
                    })}
                />
                <SendBtn onClick={connectSocket}>채팅 참가하기</SendBtn>
            </>
        }
        {activate &&
            <>
                <div>참여 중인 유저 목록</div>
                <UsersBox>
                    {activateUser.map((user, idx) => (
                        <div key={idx}>{user.nickname} ({user.id})</div>
                    ))}
                </UsersBox>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
                <MessageContainer>
                    {messages.map((msg, idx) => (
                        <Message key={idx} isMine={msg.sender === nickname}>
                            <Sender>{msg.sender}</Sender>
                            <Body>{msg.body}</Body>
                        </Message>
                    ))}
                </MessageContainer>
                <InputContainer>
                    <MessageInputBox
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
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                    />
                    <SendBtn onClick={handleSendMsg}>보내기</SendBtn>
                </InputContainer>
            </>
        }
    </StyledMainSection>
            </MainContent>
        </Container>
    )
};

export default Chat;
