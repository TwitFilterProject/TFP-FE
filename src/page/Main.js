import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import logo from '../Images/logo.png';
import cleansLogo from '../Images/cleans-logo.png';
import home from '../Images/home.png';
import chat from '../Images/chat.png';
import searchIcon from '../Images/search.png';
import profile from '../Images/profile-user.png';

import styled from "styled-components";

// 스타일 컴포넌트 정의
export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

export const PostProfile = styled.div`
    display: flex;
`;

export const TopSection = styled.div`
    display: flex;
    width: 100%;
    padding: 10px;
    background-color: #f8f9fa;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 20px; /* 로고에 왼쪽 마진 추가 */
`;

export const Logo = styled.img`
    width: 60px;
    height: 60px;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 10px;
`;

export const SearchBar = styled.div`
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 5px 10px;
    width: 100%;
`;

export const SearchInput = styled.input`
    border: none;
    outline: none;
    flex: 1;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 16px;
`;

export const SearchIcon = styled.img`
    width: 24px;
    height: 24px;
`;

export const MainContent = styled.div`
    display: flex;
    width: 100%;
    margin-top: 20px;
`;

export const Navigator = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 20px; /* 네비게이터에 왼쪽 마진 추가 */
    padding-right: 20px;
    border-right: 1px solid #ccc;
    height: calc(100vh - 60px); // TopSection 높이 제외
    position: sticky;
    top: 60px; // TopSection 높이
`;

export const NavItem = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    font-size: 18px;
    cursor: pointer;
    &:hover {
        color: #007bff;
    }
`;

export const NavIcon = styled.img`
    width: 30px;
    height: 30px;
    margin-right: 10px;
    margin-left: 20px; /* 네비게이터 아이콘에 왼쪽 마진 추가 */
`;

export const MainSection = styled.div`
    flex: 1;
    padding: 20px;
    background-color: #f8f9fa;
    border-left: 1px solid #ccc;
`;

// 게시물 스타일 컴포넌트 정의
const PostContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    background-color: white;
    margin-bottom: 10px;
    border-radius: 10px;
`;

const PostHeader = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 10px;
`;

const ProfileImg = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
`;

const PostContent = styled.div`
    display: flex;
    flex-direction: column;
`;

const Nickname = styled.span`
    font-weight: bold;
    margin-bottom: 5px;
`;

const PostText = styled.p`
    margin: 0;
`;

const Main = () => {
    const nav = useNavigate();

    const [search, setSearch] = useState("");
    const [posts, setPost] = useState(null);

    const onChange = (e) => {
        setSearch(e.target.value);
    };

    // 샘플 게시물 데이터
    // const posts = [
    //     { id: 1, nickname: "User1", text: "이것은 첫 번째 게시물입니다." },
    //     { id: 2, nickname: "User2", text: "여기는 두 번째 게시물입니다." },
    // ];

    const getPosts = async () => {
        const posts = await axios.get("http://localhost:8080/getFeed");
        setPost(posts.data);
    }

    useEffect(() => {
        getPosts();
    }, [])

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
                    <NavItem onClick={(() => {nav("/")})} >
                        <NavIcon src={home} alt="home"/>
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
                <MainSection>
                    {posts && posts.map((post) => {
                        return(
                            <PostContainer key={post.id}>
                                <PostHeader>
                                    <PostProfile>
                                        <ProfileImg src={profile} alt="profile"/>
                                        {/* <Nickname>{post.nickname}</Nickname> */}
                                        <Nickname>SookmyungCleans</Nickname>
                                    </PostProfile>
                                </PostHeader>
                                <PostContent>
                                    <PostText>{post.message}</PostText>
                                </PostContent>
                            </PostContainer>
                        )
                    })}
                </MainSection>
            </MainContent>
        </Container>
    );
}

export default Main;
