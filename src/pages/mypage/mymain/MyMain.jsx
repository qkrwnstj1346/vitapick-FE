import './MyMain.css';

function MyMain() {

    const userNm = sessionStorage.getItem('userNm');

    return (
        <div className="myMain">

            <div className="myMainCard">

                <div className="myMainText">
                    <h2>{userNm}님 안녕하세요 👋</h2>
                    <p>
                        비타픽 마이페이지입니다.
                    </p>
                </div>

                <div className="myMainCharacter">
                    <img
                        src="/images/VitaPick.png"
                        alt="캐릭터"
                    />
                </div>

            </div>

            <div className="myMainBanner">

                <h3>🎁 이벤트</h3>

                <p>
                    비타픽 건강 이벤트 진행중!
                </p>

            </div>

        </div>
    );
}

export default MyMain;