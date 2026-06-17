import './HealthInfo.css';

function HealthInfo() {
    const topNutrients = [
        {
            rank: 1,
            name: '오메가3',
            img: '💊',
            desc: '혈행 개선에 도움을 줄 수 있으며, 혈중 중성지방 개선에 도움을 줄 수 있어요.'
        },
        {
            rank: 2,
            name: '유산균',
            img: '🦠',
            desc: '장 건강에 도움을 주어 원활한 배변 활동과 면역력 증진에 도움을 줘요.'
        },
        {
            rank: 3,
            name: '마그네슘',
            img: 'Mg',
            desc: '신경과 근육 기능 유지에 필요하며, 에너지 이용과 피로 개선에 도움을 줘요.'
        },
        {
            rank: 4,
            name: '루테인',
            img: '👁️',
            desc: '황반색소 밀도를 유지하여 눈 건강에 도움을 줄 수 있어요.'
        },
        {
            rank: 5,
            name: '비타민D',
            img: '☀️',
            desc: '칼슘과 인이 흡수되고 이용되는 데 필요하며, 뼈 건강에 도움을 줘요.'
        }
    ];

    const categories = [
        '면역력 관리',
        '장 건강',
        '눈 건강',
        '피로 개선',
        '혈행 건강',
        '뼈 건강',
        '피부 건강'
    ];

    const themes = [
        {
            icon: '🛡️',
            title: '면역력 관리',
            desc: '면역 기능 강화에 도움을 주는 영양제 정보'
        },
        {
            icon: '🧬',
            title: '장 건강',
            desc: '장내 환경 개선과 소화 기능에 도움을 주는 영양제 정보'
        },
        {
            icon: '👁️',
            title: '눈 건강',
            desc: '눈의 피로 개선과 시력 보호에 도움을 주는 영양제 정보'
        },
        {
            icon: '🔋',
            title: '피로 개선',
            desc: '에너지 생성과 피로 회복에 도움을 주는 영양제 정보'
        },
        {
            icon: '🩸',
            title: '혈행 건강',
            desc: '혈액 순환 개선과 혈행 건강에 도움을 주는 영양제 정보'
        }
    ];

    return (
        <div className="healthPage">

            <div className="healthTop">

                <section className="healthIntro">
                    <h2>건강정보</h2>
                    <p>
                        건강한 라이프를 위한 영양 정보와<br />
                        요즘 주목받는 영양제를 만나보세요!
                    </p>
                </section>

                <section className="healthBanner">
                    <div>
                        <p>내 몸에 딱 맞는 영양 정보,</p>
                        <strong>비타픽이 알려드려요!</strong>
                    </div>

                    <div className="healthBannerIcon">
                        💚
                    </div>
                </section>

            </div>

            <div className="healthContent">

                <aside className="healthCategory">
                    <h3>요즘 뜨는 영양제</h3>

                    {categories.map((item, index) => (
                        <button key={index} type="button">
                            <span>{item}</span>
                            <span>›</span>
                        </button>
                    ))}
                </aside>

                <main className="healthMain">

                    <section className="healthSection">
                        <h3>요즘 뜨는 영양제 TOP 5</h3>

                        <div className="nutrientGrid">
                            {topNutrients.map(item => (
                                <div className="nutrientCard" key={item.rank}>

                                    <span className={`rankBadge rank${item.rank}`}>
                                        {item.rank}
                                    </span>

                                    <div className="nutrientIcon">
                                        {item.img}
                                    </div>

                                    <h4>{item.name}</h4>

                                    <p>{item.desc}</p>

                                    <button type="button">
                                        자세히 보기 〉
                                    </button>

                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="healthSection">
                        <h3>건강 테마별 추천</h3>

                        <div className="themeGrid">
                            {themes.map((item, index) => (
                                <div className="themeCard" key={index}>

                                    <div className="themeIcon">
                                        {item.icon}
                                    </div>

                                    <div>
                                        <h4>{item.title}</h4>
                                        <p>{item.desc}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </section>

                </main>

            </div>

        </div>
    );
}

export default HealthInfo;