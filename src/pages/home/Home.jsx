import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useState, useEffect } from 'react';
import { apiCall } from '../../service/apiService';

function Home({ isLoggedIn }) {

    const navigate = useNavigate();

    // 인기상품 TOP5 목록
    const [prdList, setPrdList] = useState([]);

    // 페이지 열릴 때 상품별 판매량 TOP5 가져오기
    useEffect(() => {

        const fetchTopProducts = async () => {

            try {

                const data = await apiCall.get('/order/top-products');

                console.log('인기상품 TOP5:', data);

                setPrdList(data);

            } catch (error) {

                console.log(error);
            }
        };

        fetchTopProducts();

    }, []);

    return (
        <main className="home">

            {/* 메인 배너 영역 */}
            <section className="mainBanner">
                <img
                    src="/images/VitaPick_MainBanner.png"
                    alt="메인 배너"
                />
            </section>

            {/* AI 맞춤 영양 설문 영역 */}
            <section className="heroSection">

                <div className="heroText">

                    <p className="heroBadge">
                        AI 맞춤 영양제 추천
                    </p>

                    <h1>
                        나에게 딱 맞는<br />
                        영양제를 찾아보세요
                    </h1>

                    <p className="heroDesc">
                        간단한 설문으로 내 건강 상태에 맞는 영양제를 추천받아보세요.
                    </p>

                    <button
                        className="heroButton"
                        onClick={() => {
                            if (!isLoggedIn) {
                                navigate('/v1/auth/login');
                            } else {
                                navigate('/v1/sur/save');
                            }
                        }}
                    >
                        설문 시작하기
                    </button>

                </div>

                <div className="heroImage">
                    <img
                        src="/images/VitaPick_ChatBot.png"
                        alt="VitaPick 챗봇 캐릭터"
                    />
                </div>

            </section>

            {/* 추천상품 영역 */}
            <section className="productSection">

                <div className="sectionTitleBox">
                    <p className="sectionBadge">VitaPick 인기상품</p>
                    <h2>가장 주목받는 VitaPick!</h2>
                </div>

                <div className="productList">

                    {prdList.map((prd, index) => (

                        <div
                            key={prd[0]}
                            className="productCard"
                            onClick={() => navigate(`/products/detail/${prd[0]}`)}
                        >
                            {/* 상품 썸네일 이미지 */}
                            <img
                                src={prd[2]}
                                alt={prd[1]}
                                className="productImage"
                            />

                            {/* 순위 */}
                            <p className="productCategory">
                                BEST {index + 1}
                            </p>

                            {/* 상품명 */}
                            <h3>{prd[1]}</h3>

                            {/* 판매량 */}
                            <p className="productDesc">
                                {prd[3]}명이 선택한 인기 상품
                            </p>

                        </div>

                    ))}

                </div>

            </section>

        </main>
    );
}

export default Home;