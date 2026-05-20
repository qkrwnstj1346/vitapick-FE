import './Header.css';

import {
    UserRound,
    ShoppingCart,
    Headphones,
    Menu,
    Search,
    LogOut,
    Sparkles,
    Trophy,
    Bot,
    Gift
} from 'lucide-react';

import { Link } from 'react-router-dom';

function Header({ userInfo, isLoggedIn, onLogout }) {

    return (

        <header className="header">

            {/* 상단 헤더 */}
            <div className="headerTop">

                {/* 로고 */}
                <div className="headerLogo">

                    <Link to="/">

                        <img
                            src="/images/VitaPick_Logo.png"
                            alt="VitaPick 로고"
                        />

                    </Link>

                </div>

                {/* 검색창 */}
                <div className="headerSearch">

                    <input
                        type="text"
                        placeholder="비타민, 유산균, 오메가3 검색"
                    />

                    <button>

                        <Search size={22} />

                    </button>

                </div>

                {/* 우측 메뉴 */}
                <div className="headerMenu">

                    <ul>

                        {isLoggedIn ? (

                            <>

                                {/* 마이페이지 */}
                                <li className="menuItem">

                                    <Link to="/mypage">

                                        <div className="menuIcon">

                                            <UserRound
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>
                                            {userInfo?.userNm || '회원'}님
                                        </p>

                                    </Link>

                                </li>

                                {/* 로그아웃 */}
                                <li className="menuItem">

                                    <Link
                                        to="/"
                                        onClick={onLogout}
                                    >

                                        <div className="menuIcon">

                                            <LogOut
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>로그아웃</p>

                                    </Link>

                                </li>

                                {/* 장바구니 */}
                                <li className="menuItem">

                                    <Link to="/cart">

                                        <div className="menuIcon">

                                            <ShoppingCart
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>장바구니</p>

                                    </Link>

                                </li>

                                {/* 고객센터 */}
                                <li className="menuItem">

                                    <Link to="/cscenter">

                                        <div className="menuIcon">

                                            <Headphones
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>고객센터</p>

                                    </Link>

                                </li>

                            </>

                        ) : (

                            <>

                                {/* 로그인 */}
                                <li className="menuItem">

                                    <Link to="/v1/auth/login">

                                        <div className="menuIcon">

                                            <UserRound
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>로그인</p>

                                    </Link>

                                </li>

                                {/* 마이페이지 */}
                                <li className="menuItem">

                                    <Link to="/login">

                                        <div className="menuIcon">

                                            <Sparkles
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>마이페이지</p>

                                    </Link>

                                </li>

                                {/* 장바구니 */}
                                <li className="menuItem">

                                    <Link to="/login">

                                        <div className="menuIcon">

                                            <ShoppingCart
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>장바구니</p>

                                    </Link>

                                </li>

                                {/* 고객센터 */}
                                <li className="menuItem">

                                    <Link to="/cscenter">

                                        <div className="menuIcon">

                                            <Headphones
                                                size={28}
                                                strokeWidth={1.8}
                                            />

                                        </div>

                                        <p>고객센터</p>

                                    </Link>

                                </li>

                            </>

                        )}

                    </ul>

                </div>

            </div>

            {/* GNB */}
            <nav className="gnb">

                <ul className="gnbMenu">

                    {/* 카테고리 */}
                    <li className="categoryMenu">

                        <div className="categoryTitle">

                            <Menu
                                size={20}
                                strokeWidth={2}
                            />

                            <span className="categoryText">
                                카테고리
                            </span>

                            <span className="categoryTextHover">
                                전체보기
                            </span>

                        </div>

                        {/* 드롭다운 */}
                        <div className="categoryDropdown">

                            <Link to="/">종합영양</Link>

                            <Link to="/">유산균</Link>

                            <Link to="/">비타민</Link>

                            <Link to="/">오메가3</Link>

                            <Link to="/">미네랄</Link>

                            <Link to="/">뷰티/다이어트</Link>

                        </div>

                    </li>

                    {/* 오늘의 추천 */}
                    <li>

                        <Link to="/recommend">

                            <Sparkles size={17} />

                            오늘의 추천

                        </Link>

                    </li>

                    {/* 베스트 */}
                    <li>

                        <Link to="/best">

                            <Trophy size={17} />

                            베스트

                        </Link>

                    </li>

                    {/* AI 설문 */}
                    <li>

                        <Link to="/survey">

                            <Bot size={17} />

                            AI 설문

                        </Link>

                    </li>

                    {/* 이벤트 */}
                    <li>

                        <Link to="/event">

                            <Gift size={17} />

                            이벤트

                        </Link>

                    </li>

                    {/* join */}
                    <li>

                        <Link to="/v1/auth/join">

                            <Sparkles size={17} />

                            join

                        </Link>

                    </li>

                </ul>

            </nav>

        </header>

    );

}

export default Header;