import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useState, useEffect } from 'react';
import { apiCall, getToken } from '../../service/apiService';

function Home({isLoggedIn}) {
    const navigate = useNavigate();

    // 홈에 보여줄 상품 목록
    const [prdList, setPrdList] = useState([]);

    // 페이지 열릴 때 카테고리별 상품 1개씩 가져오기
    // useEffect(() => {
    //     const token = getToken();

    //     const categories = [
    //         { catCd: 6, name: '종합영양' },
    //         { catCd: 1, name: '유산균' },
    //         { catCd: 2, name: '비타민' },
    //         { catCd: 3, name: '오메가3' },
    //         { catCd: 4, name: '미네랄' },
    //     ];

    //     const fetchPrds = async () => {
    //         const result = [];
    //         for (const cat of categories) {
    //             const data = await apiCall(`/api/v1/product/list/category/${cat.catCd}`, 'GET', null, false);
    //             result.push({ ...data[0], catName: cat.name });
    //         }
    //         setPrdList(result);
    //     };

    //     fetchPrds();
    // }, []);

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

                    <button className="heroButton" onClick={()=>{
                        if(!isLoggedIn){
                            navigate('/v1/auth/login');
                        }else{
                            navigate('/v1/sur/save');
                        }
                    }}>
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
                    <p className="sectionBadge">VitaPick 추천상품</p>
                    <h2>지금 가장 인기있는 영양제</h2>
                    <p>상품 데이터 연결 전까지 임시 상품 카드로 영역을 잡아둡니다.</p>
                </div>

                <div className="productList">
                    {/* 카테고리별 대표 상품 1개씩 보여주기 */}
                    {prdList.map((prd) => (
                        // 상품 카드 - 클릭하면 상품 상세 페이지로 이동
                        <div
                            key={prd.prdId}
                            className="productCard"
                            onClick={() => navigate(`/products/detail/${prd.prdId}`)}
                        >
                    {/* 상품 썸네일 이미지 */}
                    <img src={prd.thumbImgUrl} alt={prd.prdNm} className="productImage" />

                    {/* 카테고리 이름 */}
                    <p className="productCategory">{prd.catName}</p>

                    {/* 상품명 */}
                    <h3>{prd.prdNm}</h3>

                    {/* 상품 설명 */}
                    <p className="productDesc">{prd.descTxt}</p>

                    {/* 가격 */}
                    <strong>{prd.price.toLocaleString()}원</strong>
                </div>
            ))}
        </div>
            </section>

            

        </main>
    );

}

export default Home;