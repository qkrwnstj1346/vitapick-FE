import './App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    apiCall,
    saveToken,
    getToken,
    removeToken,
} from './service/apiService';

import {UsersApi} from './service/usersApi';


import Header from './components/layout/Header';
import Main from './components/layout/Main';
import Footer from './components/layout/Footer';

import Chatbot from './pages/chatbot/Chatbot';

function App() {
    const navigate = useNavigate();// 로그인 상태
    const [userNm, setUserNm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);// 회원 정보
    const [isChatOpen, setIsChatOpen] = useState(false);// 챗봇 열림/닫힘

    // 로그인 확인
    // => 브라우져의 sessionStorage에서 로그인정보 확인
    if ( !isLoggedIn ) {
        const accessToken = sessionStorage.getItem("accessToken");
        const userNm = sessionStorage.getItem("userNm");
        if(accessToken !== null){
            alert(`** sessionStorage 로그인 확인 userName=${userNm}`);
            setIsLoggedIn(true);
            setUserNm(userNm);
        }
    }

    // 로그인 함수
    const onLoginSubmit = async (loginId, pwd) => {
        await UsersApi.login(loginId, pwd)
        .then((response)=>{
            sessionStorage.setItem("accessToken", response.accessToken);
            sessionStorage.setItem("usersNum", response.userNum);
            sessionStorage.setItem("loginId", response.loginId);
            sessionStorage.setItem("usersNm", response.userNm);
            sessionStorage.setItem("roleCd", response.roleCd);
        alert(`로그인 성공 response =${response.id}`);
        setIsLoggedIn(true);
        setUserNm(response.userNm);
        navigate("/");
    }).catch((err)=>{
        setIsLoggedIn(false);
        setUserInfo('');
        if (err.status===502) { alert("id 또는 password 가 다릅니다, 다시하세요 ~~");
        }else { alert(`** onLoginSubmit 시스템 오류, err=${err}`); }
        navigate("/login");
    });////MemberApi.login
    };//onLoginSubmits

    // 로그아웃
    const onLogout = async () => {
        await UsersApi.logout()
        //=> 로그인상태값 과 loginInfo 값 초기화  
        //=> sessionStorage.removeItem("loginInfo");
        sessionStorage.clear();
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName('');
        alert("로그아웃 되었습니다.");
        // 홈 이동
        navigate("/");
    };


    return (

        <div className="App">

            <Header
                userInfo={userInfo}
                isLoggedIn={isLoggedIn}
                onLogout={onLogout}
            />

            <Main
                onLoginSubmit={onLoginSubmit}
            />

            <Footer />

        {/* 모든 페이지에서 보이는 플로팅 버튼 */}
        <div className="chatbotFloatingBtn" onClick={() => {
            if (isLoggedIn) {
                setIsChatOpen(prev => !prev);
            } else {
                navigate('/v1/auth/login');
            }
        }}>
            <img src="/images/VitaPick_ChatBot_Logo.png" alt="챗봇" />
            <p className="chatbotFloatingText">ChatBot</p>
        </div>

        {/* 챗봇 팝업 */}
        {isChatOpen && (
            <Chatbot
                onClose={() => setIsChatOpen(false)}
                userInfo={userInfo}
            />
        )}

        </div>

    );

}

export default App;