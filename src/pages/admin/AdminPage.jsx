import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import './Admin.css';

const today = new Date();
const todayText = formatDate(today);
const monthText = formatMonth(today);

const pageInfo = {
    members: {
        title: '회원 관리',
        description: '가입 회원 정보를 조회하고 관리할 수 있습니다.',
        emptyText: '회원 데이터 연동 예정입니다.'
    },
    products: {
        title: '상품 관리',
        description: '등록된 상품을 조회하고 관리할 수 있습니다.',
        emptyText: '상품 데이터 연동 예정입니다.'
    },
    orders: {
        title: '주문 관리',
        description: '주문 현황을 확인하고 관리할 수 있습니다.',
        emptyText: '주문 데이터 연동 예정입니다.'
    },
    reviews: {
        title: '리뷰 관리',
        description: '상품 리뷰를 조회하고 답변 상태를 관리할 수 있습니다.',
        emptyText: '리뷰 데이터 연동 예정입니다.'
    },
    cscenter: {
        title: '고객센터 관리',
        description: '공지사항, FAQ, 1:1 문의, 고객 지원 콘텐츠를 관리할 수 있습니다.',
        emptyText: '고객센터 관리 기능은 추후 연결 예정입니다.'
    }
};

const dashboardPlaceholderData = {
    sales: {
        title: '매출 현황',
        description: '결제 완료 주문 기준 매출 통계가 표시될 예정입니다.',
        status: 'API 연결 후 표시',
        metrics: [
            { label: '오늘 매출', value: '연동 예정', basis: `기준: ${todayText}` },
            { label: '이번 달 매출', value: '연동 예정', basis: `기준: ${monthText}` },
            { label: '오늘 결제완료 주문 수', value: 'API 연결 후 표시', basis: `기준: ${todayText}` },
            {
                label: '인기 영양제 카테고리',
                value: 'API 연결 후 표시',
                basis: '기준: 이번 달 결제완료 주문 / 카테고리별 매출 합계'
            }
        ]
    },
    members: {
        title: '회원 현황',
        description: '회원 가입 통계 연동 예정',
        metrics: [
            { label: '전체 회원', value: '-' },
            { label: '활성 회원', value: '-' },
            { label: '휴면/탈퇴 회원', value: '-' }
        ]
    },
    orders: {
        title: '주문 현황',
        description: '주문 통계 연동 예정',
        statusLabels: ['결제완료', '배송준비', '배송중', '배송완료', '취소/환불']
    },
    inquiries: {
        title: '문의 처리 현황',
        description: '고객센터 문의 데이터 연동 예정',
        metrics: [
            { label: '미답변 문의', value: '-' },
            { label: '답변 완료 문의', value: '-' },
            { label: '오늘 신규 문의', value: '-' },
            { label: '문의 처리율', value: '-' }
        ]
    },
    productSalesTop5: {
        title: '상품별 매출 TOP 5',
        description: '결제 완료 주문 기준으로 매출 상위 상품이 표시될 예정입니다.',
        columns: ['순위', '상품명', '카테고리', '결제완료 수량', '매출액'],
        rows: Array.from({ length: 5 }, (_, index) => ({
            rank: `${index + 1}`,
            productName: 'API 연결 후 표시',
            category: '연동 예정',
            paidQuantity: '-',
            salesAmount: '-'
        }))
    }
};

// Visual-only placeholder values. These are not business statistics.
const placeholderLineChartPoints = '16,112 72,82 128,94 184,58 240,74 304,34';
const placeholderBarHeights = ['42%', '66%', '54%', '78%', '48%', '72%'];

function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const isAdmin = sessionStorage.getItem('roleCd') === 'ADMIN';

    if (!isAdmin) {
        return (
            <div className="adminAccessDenied">
                <div className="adminAccessCard">
                    <h1>접근 권한이 없습니다.</h1>
                    <p>관리자 계정으로 로그인한 경우에만 이용할 수 있습니다.</p>
                </div>
            </div>
        );
    }

    const renderDashboard = () => {
        const { sales, members, orders, inquiries, productSalesTop5 } = dashboardPlaceholderData;

        return (
            <div className="adminDashboard">
                <section className="adminHeroCard">
                    <div>
                        <span className="adminHeroBadge">VitaPick Admin</span>
                        <h2>운영 현황을 한눈에 확인하는 관리자 대시보드입니다.</h2>
                        <p>현재는 화면 구조 준비 단계이며, 실제 통계는 API 연결 후 표시됩니다.</p>
                    </div>
                    <div className="adminHeroBubble">VP</div>
                </section>

                <section className="adminOpsSection">
                    <div className="adminPanelHeader">
                        <div>
                            <h3>{sales.title}</h3>
                            <p>{sales.description}</p>
                        </div>
                        <span>{sales.status}</span>
                    </div>
                    <div className="adminMetricGrid">
                        {sales.metrics.map((item) => (
                            <MetricCard
                                key={item.label}
                                label={item.label}
                                value={item.value}
                                basis={item.basis}
                            />
                        ))}
                    </div>
                </section>

                <div className="adminDashboardGrid">
                    <section className="adminOpsSection">
                        <div className="adminPanelHeader">
                            <div>
                                <h3>{members.title}</h3>
                                <p>{members.description}</p>
                            </div>
                        </div>
                        <LineChartMock />
                        <div className="adminMiniMetricList">
                            {members.metrics.map((item) => (
                                <MetricCard key={item.label} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </section>

                    <section className="adminOpsSection">
                        <div className="adminPanelHeader">
                            <div>
                                <h3>{orders.title}</h3>
                                <p>{orders.description}</p>
                            </div>
                        </div>
                        <BarChartMock />
                        <div className="adminDonutWrap">
                            <div className="adminDonutChart">
                                <span>API</span>
                            </div>
                            <div className="adminDonutLegend">
                                {orders.statusLabels.map((item) => (
                                    <span key={item}>{item}</span>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="adminDashboardGrid">
                    <section className="adminOpsSection">
                        <div className="adminPanelHeader">
                            <div>
                                <h3>{inquiries.title}</h3>
                                <p>{inquiries.description}</p>
                            </div>
                        </div>
                        <div className="adminMetricGrid twoCol">
                            {inquiries.metrics.map((item) => (
                                <MetricCard key={item.label} label={item.label} value={item.value} />
                            ))}
                        </div>
                    </section>

                    <section className="adminOpsSection adminTopProductsSection">
                        <div className="adminPanelHeader">
                            <div>
                                <h3>{productSalesTop5.title}</h3>
                                <p>{productSalesTop5.description}</p>
                            </div>
                        </div>
                        <TopProductsTable data={productSalesTop5} />
                    </section>
                </div>
            </div>
        );
    };

    const renderFilterMock = (type) => (
        <section className="adminFilterCard">
            <div className="adminField">
                <label>{type === 'reviews' ? '상품명 검색' : '검색어'}</label>
                <input type="text" placeholder="검색어를 입력하세요" disabled />
            </div>
            <div className="adminField">
                <label>{type === 'reviews' ? '별점' : '상태'}</label>
                <select disabled>
                    <option>전체</option>
                </select>
            </div>
            <div className="adminField">
                <label>{type === 'orders' ? '주문 기간' : '기간 선택'}</label>
                <input type="text" placeholder="연동 예정" disabled />
            </div>
            <button type="button" className="adminPrimaryBtn" disabled>검색</button>
        </section>
    );

    const renderCsCenter = () => (
        <>
            <div className="adminFeatureGrid">
                <FeatureCard title="공지사항 관리" text="공지사항 목록과 노출 상태 관리 화면을 추후 연결합니다." />
                <FeatureCard title="FAQ 관리" text="자주 묻는 질문과 답변 관리 화면을 추후 연결합니다." />
                <FeatureCard title="1:1 문의 관리" text="고객 문의 확인과 답변 상태 관리를 추후 연결합니다." />
                <FeatureCard title="고객센터 메인 설정" text="고객센터 메인 콘텐츠 설정 화면을 추후 연결합니다." />
            </div>
            <EmptyState text={pageInfo.cscenter.emptyText} />
        </>
    );

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return renderDashboard();
        }

        if (activeTab === 'cscenter') {
            return renderCsCenter();
        }

        return (
            <>
                {activeTab === 'orders' && (
                    <div className="adminSummaryGrid compact">
                        <MetricCard label="전체 주문" value="연동 예정" />
                        <MetricCard label="배송 상태" value="준비중" />
                    </div>
                )}
                {activeTab === 'reviews' && (
                    <div className="adminStatusGrid">
                        <MetricCard label="전체 리뷰" value="연동 예정" />
                        <MetricCard label="답변 상태" value="준비중" />
                        <MetricCard label="별점 필터" value="-" />
                    </div>
                )}
                {renderFilterMock(activeTab)}
                <EmptyState text={pageInfo[activeTab].emptyText} />
            </>
        );
    };

    const currentInfo = activeTab === 'dashboard'
        ? {
            title: 'VitaPick 관리자 대시보드',
            description: '운영 현황을 한눈에 확인할 수 있는 관리자 화면입니다.'
        }
        : pageInfo[activeTab];

    return (
        <div className="adminPage">
            <AdminSidebar
                activeTab={activeTab}
                onChangeTab={setActiveTab}
            />

            <main className="adminContent">
                <header className="adminPageHeader">
                    <div>
                        <h1>{currentInfo.title}</h1>
                        <p>{currentInfo.description}</p>
                    </div>
                    <div className="adminHeaderActions">
                        <button type="button" disabled>데이터 다운로드</button>
                    </div>
                </header>

                {renderContent()}
            </main>
        </div>
    );
}

function MetricCard({ label, value, basis }) {
    return (
        <article className="adminMetricCard">
            <span>{label}</span>
            <strong>{value}</strong>
            {basis && <em>{basis}</em>}
            <p>API 연결 후 표시</p>
        </article>
    );
}

function FeatureCard({ title, text }) {
    return (
        <article className="adminFeatureCard">
            <span className="adminFeatureIcon">{title.slice(0, 1)}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <strong>추후 구현 예정</strong>
        </article>
    );
}

function TopProductsTable({ data }) {
    return (
        <div className="adminTopProductsTable">
            <div className="adminTopProductsHead">
                {data.columns.map((column) => (
                    <span key={column}>{column}</span>
                ))}
            </div>
            <div className="adminTopProductsBody">
                {data.rows.map((row) => (
                    <div className="adminTopProductsRow" key={row.rank}>
                        <span>{row.rank}</span>
                        <span>{row.productName}</span>
                        <span>{row.category}</span>
                        <span>{row.paidQuantity}</span>
                        <span>{row.salesAmount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LineChartMock() {
    return (
        <div className="adminChartCard">
            <svg className="adminLineChart" viewBox="0 0 320 140" role="img" aria-label="회원 가입 추이 연동 예정">
                <polyline points={placeholderLineChartPoints} />
                <line x1="16" y1="120" x2="304" y2="120" />
            </svg>
            <span>시각용 임시 차트 - API 연동 예정</span>
        </div>
    );
}

function BarChartMock() {
    return (
        <div className="adminChartCard">
            <div className="adminBarChart" aria-label="일일 주문 건 수 연동 예정">
                {placeholderBarHeights.map((height) => (
                    <span key={height} style={{ height }} />
                ))}
            </div>
            <span>시각용 임시 차트 - API 연동 예정</span>
        </div>
    );
}

function EmptyState({ text }) {
    return (
        <section className="adminEmptyCard">
            <div className="adminEmptyIcon">VP</div>
            <h3>{text}</h3>
            <p>이번 단계에서는 화면 구조만 준비했으며 실제 기능은 연결하지 않았습니다.</p>
        </section>
    );
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

function formatMonth(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}.${month}`;
}

export default AdminPage;
