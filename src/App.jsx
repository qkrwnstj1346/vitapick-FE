import './App.css';

import React, { useEffect, useState } from 'react';

import {
    useNavigate,
    useLocation
} from 'react-router-dom';

import {
    apiCall,
    saveToken,
    getToken,
    removeToken
} from './service/apiService';

import Header from './components/layout/Header';
import Main from './components/layout/Main';
import Footer from './components/layout/Footer';

import Chatbot from './pages/chatbot/Chatbot';

function App() {

    const navigate = useNavigate();

    /* 현재 페이지 주소 */
    const location = useLocation();

    // 로그인 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 회원 정보
    const [userInfo, setUserInfo] = useState(null);

    // 챗봇 열림/닫힘
    const [isChatOpen, setIsChatOpen] = useState(false);

    /* 챗봇 숨길 페이지 */
    const hideChatbotPaths = [
        '/cart',
        '/order'
    ];

    /* 현재 페이지가 챗봇 숨김 페이지인지 체크 */
    const isHideChatbot = hideChatbotPaths.some(path =>
        location.pathname.startsWith(path)
    );

    // 로그인 상태 확인
    useEffect(() => {

        const storedUserInfo = JSON.parse(
            localStorage.getItem("userInfo")
        );

        if (
            storedUserInfo !== null &&
            storedUserInfo.token !== null
        ) {

            setIsLoggedIn(true);

            setUserInfo(storedUserInfo);

        }

    }, []);

    // 로그인
    const onLogin = (loginId, pwd) => {

        const data = {
            loginId: loginId,
            pwd: pwd
        };

        apiCall(
            "/v1/auth/login",
            "POST",
            data,
            null,
            false
        )

            .then(response => {

                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(response)
                );

                saveToken(response.token);

                setIsLoggedIn(true);

                setUserInfo(response);

                navigate("/");

            })

            .catch(err => {

                setIsLoggedIn(false);

                setUserInfo(null);

                if (err === 502) {

                    alert("아이디 또는 비밀번호가 다릅니다");

                } else {

                    alert(`로그인 오류 => ${err}`);

                }

                navigate("/v1/auth/login");

            });

    };

    // 로그아웃
    const onLogout = () => {

        localStorage.removeItem("userInfo");

        removeToken();

        setIsLoggedIn(false);

        setUserInfo(null);

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
                token={getToken()}
                onLogin={onLogin}
                isLoggedIn={isLoggedIn}
            />

            <Footer />

            {/* 장바구니/주문서 제외 플로팅 버튼 */}
            {!isHideChatbot && (
                <div
                    className="chatbotFloatingBtn"
                    onClick={() => {

                        if (isLoggedIn) {

                            setIsChatOpen(prev => !prev);

                        } else {

                            navigate('/v1/auth/login');

                        }

                    }}
                >

                    <img
                        src="/images/VitaPick_ChatBot_Logo.png"
                        alt="챗봇"
                    />

                    <p className="chatbotFloatingText">
                        ChatBot
                    </p>

                </div>
            )}

            {/* 장바구니/주문서 제외 챗봇 팝업 */}
            {!isHideChatbot && isChatOpen && (
                <Chatbot
                    onClose={() => setIsChatOpen(false)}
                    userInfo={userInfo}
                />
            )}

        </div>

    );

}

export default App;