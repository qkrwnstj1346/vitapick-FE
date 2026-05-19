import './Home.css';

function Home() {

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

                    <button className="heroButton">
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
                    <div className="productCard">
                        <div className="productImage">상품 이미지</div>
                        <p className="productCategory">비타민</p>
                        <h3>멀티비타민</h3>
                        <p className="productDesc">하루 건강 밸런스를 위한 기본 영양제</p>
                        <strong>29,000원</strong>
                    </div>
                    <div className="productCard">
                        <div className="productImage">상품 이미지</div>
                        <p className="productCategory">오메가3</p>
                        <h3>오메가3 플러스</h3>
                        <p className="productDesc">혈행 건강을 위한 데일리 케어</p>
                        <strong>34,000원</strong>
                    </div>
                    <div className="productCard">
                        <div className="productImage">상품 이미지</div>
                        <p className="productCategory">마그네슘</p>
                        <h3>마그네슘 케어</h3>
                        <p className="productDesc">피로 관리와 편안한 휴식을 위한 영양제</p>
                        <strong>22,000원</strong>
                    </div>
                    <div className="productCard">
                        <div className="productImage">상품 이미지</div>
                        <p className="productCategory">비타민D</p>
                        <h3>비타민D 데일리</h3>
                        <p className="productDesc">햇빛이 부족한 날을 위한 데일리 보충</p>
                        <strong>18,000원</strong>
                    </div>
                    <div className="productCard">
                        <div className="productImage">상품 이미지</div>
                        <p className="productCategory">유산균</p>
                        <h3>프로바이오틱스</h3>
                        <p className="productDesc">장 건강을 위한 가벼운 하루 루틴</p>
                        <strong>31,000원</strong>
                    </div>
                </div>
            </section>



        </main>
    );

}

export default Home;