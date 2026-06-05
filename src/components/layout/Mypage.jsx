import { NavLink, Outlet } from 'react-router-dom';

import './Mypage.css';

function Mypage() {

    return (
        <div className="mypageWrap">

            {/* 사이드바 */}
            <div className="mypageSidebar">

                <h2 className="mypageTitle">
                    마이페이지
                </h2>

                <ul className="mypageMenu">

                    <li>
                        <NavLink to="/mypage/profile">
                            회원정보 수정
                        </NavLink>
                    </li>

                    <li>주문 내역</li>

                    <li>찜한 상품</li>

                    <li>내 비타민 추천</li>

                    <li>AI 챗봇</li>

                    <li>배송지 관리</li>

                    <li>리뷰 관리</li>

                    <li>회원 탈퇴</li>

                </ul>

            </div>

            {/* 컨텐츠 영역 */}
            <div className="mypageContent">
                <Outlet />
            </div>

        </div>
    );
}

export default Mypage;