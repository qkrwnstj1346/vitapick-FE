import './App.css';

import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
//testtesttest

import {
    apiCall,
    saveToken,
    getToken,
    removeToken
} from './service/apiService';

import Header from './components/layout/Header';
import Main from './components/layout/Main';
import Footer from './components/layout/Footer';

function App() {

    const navigate = useNavigate();

    // 로그인 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 회원 정보
    const [userInfo, setUserInfo] = useState(null);

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

                // localStorage 저장
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify(response)
                );

                // 토큰 저장
                saveToken(response.token);

                // 로그인 상태 변경
                setIsLoggedIn(true);

                // 회원 정보 저장
                setUserInfo(response);

                // 홈 이동
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

        // localStorage 삭제
        localStorage.removeItem("userInfo");

        // 토큰 삭제
        removeToken();

        // 로그인 상태 변경
        setIsLoggedIn(false);

        // 회원 정보 초기화
        setUserInfo(null);

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
                token={getToken()}
                onLogin={onLogin}
            />

            <Footer />

        </div>

    );

}

export default App;