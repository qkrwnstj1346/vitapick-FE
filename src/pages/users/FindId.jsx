import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UsersApi } from '../../service/usersApi';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

function FindId() {
    const navigate = useNavigate();

    const [userNm, setUserNm] = useState("");
    const [email, setEmail] = useState("");

    const [foundId, setFoundId] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    } = useForm();

    const nameRegex = /^[가-힣a-zA-Z\s]{2,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const onFindIdSubmit = async (e) => {
        e.preventDefault();

        setFoundId("");
        setErrorMsg("");

        const trimmedUserNm = userNm.trim();
        const trimmedEmail = email.trim();

        if (trimmedUserNm.length === 0) {
            setErrorMsg("이름을 입력해주세요.");
            return;
        }

        if (trimmedEmail.length === 0) {
            setErrorMsg("이메일을 입력해주세요.");
            return;
        }

        try {
            setIsLoading(true);

            const response = await UsersApi.findId(trimmedUserNm, trimmedEmail);

            console.log("아이디 찾기 성공 response =", response);

            setFoundId(response.loginId);
        } catch (err) {
            console.log("아이디 찾기 실패 err =", err);

            if (err.response?.status === 404) {
                setErrorMsg("일치하는 회원 정보가 없습니다.");
            } else {
                setErrorMsg("아이디 찾기 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='body_container'>
            <hr />

            <h2 style={{ color: '#7FAF8B' }}>아이디 찾기</h2>

            <div>
                <form autoComplete='off' onSubmit={onFindIdSubmit}>
                    <input
                        type="text"
                        name="userNm"
                        placeholder="이름"
                        autoComplete='off'
                        size={20}
                        value={userNm}
                        onChange={(e) => setUserNm(e.target.value)}
                    />
                    <br />

                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        autoComplete='off'
                        size={20}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br />
                    <br />

                    <input
                        type="submit"
                        className="loginBtn"
                        value={isLoading ? "찾는 중..." : "아이디 찾기"}
                        style={{ width: 175 }}
                        disabled={isLoading}
                    />
                    <br />
                    <br />
                </form>

                {errorMsg && (
                    <p style={{ color: "red", fontSize: "14px" }}>
                        {errorMsg}
                    </p>
                )}

                {foundId && (
                    <div style={{ marginTop: "15px" }}>
                        <p>
                            가입된 아이디는&nbsp;
                            <strong style={{ color: "#7547a3" }}>
                                {foundId}
                            </strong>
                            &nbsp;입니다.
                        </p>

                        <button
                            type="button"
                            className="loginBtn"
                            style={{ width: 175 }}
                            onClick={() => navigate("/v1/auth/login")}
                        >
                            로그인하러 가기
                        </button>
                    </div>
                )}

                <div className="find-links">
                    <Link to="/v1/auth/login">로그인</Link>
                    <span className="divider">|</span>
                    <Link to="/v1/auth/join">회원가입</Link>
                </div>
            </div>
        </div>
    );
}

export default FindId;