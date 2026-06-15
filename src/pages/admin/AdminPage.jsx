import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { getAdminDashboardSummary } from '../../service/admin/adminDashboardApi';
import { getAdminOrders } from '../../service/admin/adminOrdersApi';
import { getAdminProducts } from '../../service/admin/adminProductsApi';
import { getAdminReviews } from '../../service/admin/adminReviewsApi';
import { getAdminUsers } from '../../service/admin/adminUsersApi';
import './Admin.css';

const today = new Date();
const todayText = formatDate(today);
const monthText = formatMonth(today);
const adminUsersPageSize = 10;
const adminProductsPageSize = 10;
const adminOrdersPageSize = 10;
const adminReviewsPageSize = 10;
const statusCdOptions = [
    { value: '', label: '전체' },
    { value: 'ACTIVE', label: '활성' },
    { value: 'W', label: '탈퇴' }
];
const productStatusOptions = [
    { value: '', label: '전체' },
    { value: 'Y', label: '사용' },
    { value: 'N', label: '미사용' }
];
const productCategoryOptions = [
    { value: '', label: '전체' },
    { value: '1', label: '유산균' },
    { value: '2', label: '비타민' },
    { value: '3', label: '오메가3' },
    { value: '4', label: '미네랄' },
    { value: '5', label: '뷰티/다이어트' },
    { value: '6', label: '종합영양' }
];
const orderStatusOptions = [
    { value: '', label: '전체' },
    { value: 'PAID', label: '결제완료' }
];
const reviewRatingOptions = [
    { value: '', label: '전체' },
    { value: '1', label: '1점' },
    { value: '2', label: '2점' },
    { value: '3', label: '3점' },
    { value: '4', label: '4점' },
    { value: '5', label: '5점' }
];
const reviewUseYnOptions = [
    { value: 'Y', label: '표시' },
    { value: 'N', label: '숨김' }
];
const roleCdOptions = [
    { value: '', label: '전체' },
    { value: 'ADMIN', label: '관리자' },
    { value: 'USER', label: '회원' }
];

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
    const [dashboardData, setDashboardData] = useState(dashboardPlaceholderData);
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardError, setDashboardError] = useState('');
    const [adminUsers, setAdminUsers] = useState([]);
    const [adminUsersLoading, setAdminUsersLoading] = useState(false);
    const [adminUsersError, setAdminUsersError] = useState('');
    const [adminUsersKeyword, setAdminUsersKeyword] = useState('');
    const [adminUsersStatusCd, setAdminUsersStatusCd] = useState('');
    const [adminUsersRoleCd, setAdminUsersRoleCd] = useState('');
    const [adminUsersPage, setAdminUsersPage] = useState(0);
    const [adminUsersTotalPages, setAdminUsersTotalPages] = useState(0);
    const [adminUsersTotalElements, setAdminUsersTotalElements] = useState(0);
    const [adminProducts, setAdminProducts] = useState([]);
    const [adminProductsLoading, setAdminProductsLoading] = useState(false);
    const [adminProductsError, setAdminProductsError] = useState('');
    const [adminProductsKeyword, setAdminProductsKeyword] = useState('');
    const [adminProductsStatus, setAdminProductsStatus] = useState('');
    const [adminProductsCategoryId, setAdminProductsCategoryId] = useState('');
    const [adminProductsPage, setAdminProductsPage] = useState(0);
    const [adminProductsTotalPages, setAdminProductsTotalPages] = useState(0);
    const [adminProductsTotalElements, setAdminProductsTotalElements] = useState(0);
    const [adminOrders, setAdminOrders] = useState([]);
    const [adminOrdersLoading, setAdminOrdersLoading] = useState(false);
    const [adminOrdersError, setAdminOrdersError] = useState('');
    const [adminOrdersKeyword, setAdminOrdersKeyword] = useState('');
    const [adminOrdersStatus, setAdminOrdersStatus] = useState('');
    const [adminOrdersStartDate, setAdminOrdersStartDate] = useState('');
    const [adminOrdersEndDate, setAdminOrdersEndDate] = useState('');
    const [adminOrdersPage, setAdminOrdersPage] = useState(0);
    const [adminOrdersTotalPages, setAdminOrdersTotalPages] = useState(0);
    const [adminOrdersTotalElements, setAdminOrdersTotalElements] = useState(0);
    const [adminReviews, setAdminReviews] = useState([]);
    const [adminReviewsLoading, setAdminReviewsLoading] = useState(false);
    const [adminReviewsError, setAdminReviewsError] = useState('');
    const [adminReviewsKeyword, setAdminReviewsKeyword] = useState('');
    const [adminReviewsRating, setAdminReviewsRating] = useState('');
    const [adminReviewsStartDate, setAdminReviewsStartDate] = useState('');
    const [adminReviewsEndDate, setAdminReviewsEndDate] = useState('');
    const [adminReviewsPage, setAdminReviewsPage] = useState(0);
    const [adminReviewsTotalPages, setAdminReviewsTotalPages] = useState(0);
    const [adminReviewsTotalElements, setAdminReviewsTotalElements] = useState(0);
    const isAdmin = sessionStorage.getItem('roleCd') === 'ADMIN';

    useEffect(() => {
        if (!isAdmin) return;

        let isMounted = true;

        const fetchDashboardSummary = async () => {
            setDashboardLoading(true);
            setDashboardError('');

            try {
                const summary = await getAdminDashboardSummary();
                if (!isMounted) return;
                setDashboardData(createDashboardData(summary));
            } catch (error) {
                console.error('관리자 대시보드 summary 조회 실패:', error);
                if (!isMounted) return;
                setDashboardData(dashboardPlaceholderData);
                setDashboardError('대시보드 데이터를 불러오지 못해 기본 안내값을 표시합니다.');
            } finally {
                if (isMounted) {
                    setDashboardLoading(false);
                }
            }
        };

        fetchDashboardSummary();

        return () => {
            isMounted = false;
        };
    }, [isAdmin]);

    useEffect(() => {
        if (!isAdmin || activeTab !== 'members') return;

        let isMounted = true;

        const fetchAdminUsers = async () => {
            setAdminUsersLoading(true);
            setAdminUsersError('');

            try {
                const response = await getAdminUsers({
                    page: adminUsersPage,
                    size: adminUsersPageSize,
                    keyword: adminUsersKeyword.trim() || undefined,
                    statusCd: adminUsersStatusCd || undefined,
                    roleCd: adminUsersRoleCd || undefined
                });

                if (!isMounted) return;

                setAdminUsers(Array.isArray(response?.content) ? response.content : []);
                setAdminUsersTotalPages(Number(response?.totalPages) || 0);
                setAdminUsersTotalElements(Number(response?.totalElements) || 0);
            } catch (error) {
                console.error('관리자 회원 목록 조회 실패:', error);
                if (!isMounted) return;
                setAdminUsers([]);
                setAdminUsersTotalPages(0);
                setAdminUsersTotalElements(0);
                setAdminUsersError('회원 목록을 불러오지 못했습니다.');
            } finally {
                if (isMounted) {
                    setAdminUsersLoading(false);
                }
            }
        };

        fetchAdminUsers();

        return () => {
            isMounted = false;
        };
    }, [activeTab, adminUsersKeyword, adminUsersPage, adminUsersRoleCd, adminUsersStatusCd, isAdmin]);

    useEffect(() => {
        if (!isAdmin || activeTab !== 'products') return;

        let isMounted = true;

        const fetchAdminProducts = async () => {
            setAdminProductsLoading(true);
            setAdminProductsError('');

            try {
                const response = await getAdminProducts({
                    page: adminProductsPage,
                    size: adminProductsPageSize,
                    keyword: adminProductsKeyword.trim() || undefined,
                    status: adminProductsStatus || undefined,
                    categoryId: adminProductsCategoryId || undefined
                });

                if (!isMounted) return;

                setAdminProducts(Array.isArray(response?.content) ? response.content : []);
                setAdminProductsTotalPages(Number(response?.totalPages) || 0);
                setAdminProductsTotalElements(Number(response?.totalElements) || 0);
            } catch (error) {
                console.error('관리자 상품 목록 조회 실패:', error);
                if (!isMounted) return;
                setAdminProducts([]);
                setAdminProductsTotalPages(0);
                setAdminProductsTotalElements(0);
                setAdminProductsError('상품 목록을 불러오지 못했습니다.');
            } finally {
                if (isMounted) {
                    setAdminProductsLoading(false);
                }
            }
        };

        fetchAdminProducts();

        return () => {
            isMounted = false;
        };
    }, [activeTab, adminProductsCategoryId, adminProductsKeyword, adminProductsPage, adminProductsStatus, isAdmin]);

    useEffect(() => {
        if (!isAdmin || activeTab !== 'orders') return;

        let isMounted = true;

        const fetchAdminOrders = async () => {
            setAdminOrdersLoading(true);
            setAdminOrdersError('');

            try {
                const response = await getAdminOrders({
                    page: adminOrdersPage,
                    size: adminOrdersPageSize,
                    keyword: adminOrdersKeyword.trim() || undefined,
                    status: adminOrdersStatus || undefined,
                    startDate: adminOrdersStartDate || undefined,
                    endDate: adminOrdersEndDate || undefined
                });

                if (!isMounted) return;

                setAdminOrders(Array.isArray(response?.content) ? response.content : []);
                setAdminOrdersTotalPages(Number(response?.totalPages) || 0);
                setAdminOrdersTotalElements(Number(response?.totalElements) || 0);
            } catch (error) {
                console.error('관리자 주문 목록 조회 실패:', error);
                if (!isMounted) return;
                setAdminOrders([]);
                setAdminOrdersTotalPages(0);
                setAdminOrdersTotalElements(0);
                setAdminOrdersError('주문 목록을 불러오지 못했습니다.');
            } finally {
                if (isMounted) {
                    setAdminOrdersLoading(false);
                }
            }
        };

        fetchAdminOrders();

        return () => {
            isMounted = false;
        };
    }, [
        activeTab,
        adminOrdersEndDate,
        adminOrdersKeyword,
        adminOrdersPage,
        adminOrdersStartDate,
        adminOrdersStatus,
        isAdmin
    ]);

    useEffect(() => {
        if (!isAdmin || activeTab !== 'reviews') return;

        let isMounted = true;

        const fetchAdminReviews = async () => {
            setAdminReviewsLoading(true);
            setAdminReviewsError('');

            try {
                const response = await getAdminReviews({
                    page: adminReviewsPage,
                    size: adminReviewsPageSize,
                    keyword: adminReviewsKeyword.trim() || undefined,
                    rating: adminReviewsRating || undefined,
                    startDate: adminReviewsStartDate || undefined,
                    endDate: adminReviewsEndDate || undefined
                });

                if (!isMounted) return;

                setAdminReviews(Array.isArray(response?.content) ? response.content : []);
                setAdminReviewsTotalPages(Number(response?.totalPages) || 0);
                setAdminReviewsTotalElements(Number(response?.totalElements) || 0);
            } catch (error) {
                console.error('관리자 리뷰 목록 조회 실패:', error);
                if (!isMounted) return;
                setAdminReviews([]);
                setAdminReviewsTotalPages(0);
                setAdminReviewsTotalElements(0);
                setAdminReviewsError('리뷰 목록을 불러오지 못했습니다.');
            } finally {
                if (isMounted) {
                    setAdminReviewsLoading(false);
                }
            }
        };

        fetchAdminReviews();

        return () => {
            isMounted = false;
        };
    }, [
        activeTab,
        adminReviewsEndDate,
        adminReviewsKeyword,
        adminReviewsPage,
        adminReviewsRating,
        adminReviewsStartDate,
        isAdmin
    ]);

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
        const { sales, members, orders, inquiries, productSalesTop5 } = dashboardData;

        return (
            <div className="adminDashboard">
                {(dashboardLoading || dashboardError) && (
                    <div className="adminDashboardNotice">
                        {dashboardLoading ? '대시보드 데이터를 불러오는 중입니다.' : dashboardError}
                    </div>
                )}
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
                                note={item.note}
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
                                <MetricCard key={item.label} label={item.label} value={item.value} note={item.note} />
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
                                <MetricCard key={item.label} label={item.label} value={item.value} note={item.note} />
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

    const handleAdminUsersSearch = (event) => {
        event.preventDefault();
        setAdminUsersPage(0);
    };

    const handleAdminUsersFilterChange = (setter) => (event) => {
        setter(event.target.value);
        setAdminUsersPage(0);
    };

    const renderMembers = () => (
        <>
            <form className="adminFilterCard" onSubmit={handleAdminUsersSearch}>
                <div className="adminField">
                    <label>검색어</label>
                    <input
                        type="text"
                        value={adminUsersKeyword}
                        onChange={(event) => {
                            setAdminUsersKeyword(event.target.value);
                            setAdminUsersPage(0);
                        }}
                        placeholder="아이디 또는 이름을 입력하세요"
                    />
                </div>
                <div className="adminField">
                    <label>회원 상태</label>
                    <select
                        value={adminUsersStatusCd}
                        onChange={handleAdminUsersFilterChange(setAdminUsersStatusCd)}
                    >
                        {statusCdOptions.map((option) => (
                            <option key={option.value || 'all-status'} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="adminField">
                    <label>권한</label>
                    <select
                        value={adminUsersRoleCd}
                        onChange={handleAdminUsersFilterChange(setAdminUsersRoleCd)}
                    >
                        {roleCdOptions.map((option) => (
                            <option key={option.value || 'all-role'} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="adminPrimaryBtn">검색</button>
            </form>

            <section className="adminOpsSection">
                <div className="adminPanelHeader">
                    <div>
                        <h3>회원 목록</h3>
                        <p>총 {adminUsersTotalElements.toLocaleString()}명의 회원을 조회했습니다.</p>
                    </div>
                    <span>{adminUsersLoading ? '조회 중' : `${adminUsersPage + 1} / ${Math.max(adminUsersTotalPages, 1)}`}</span>
                </div>

                {adminUsersError && (
                    <div className="adminDashboardNotice">{adminUsersError}</div>
                )}

                {!adminUsersError && adminUsersLoading && (
                    <div className="adminDashboardNotice">회원 목록을 불러오는 중입니다.</div>
                )}

                {!adminUsersError && !adminUsersLoading && adminUsers.length === 0 && (
                    <div className="adminUsersEmpty">회원 데이터가 없습니다.</div>
                )}

                {!adminUsersError && adminUsers.length > 0 && (
                    <>
                        <AdminUsersTable users={adminUsers} />
                        <div className="adminPagination">
                            <button
                                type="button"
                                disabled={adminUsersPage <= 0 || adminUsersLoading}
                                onClick={() => setAdminUsersPage((page) => Math.max(page - 1, 0))}
                            >
                                이전
                            </button>
                            <span>{adminUsersPage + 1} / {Math.max(adminUsersTotalPages, 1)}</span>
                            <button
                                type="button"
                                disabled={adminUsersPage + 1 >= adminUsersTotalPages || adminUsersLoading}
                                onClick={() => setAdminUsersPage((page) => page + 1)}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </section>
        </>
    );

    const handleAdminProductsSearch = (event) => {
        event.preventDefault();
        setAdminProductsPage(0);
    };

    const handleAdminProductsFilterChange = (setter) => (event) => {
        setter(event.target.value);
        setAdminProductsPage(0);
    };

    const renderProducts = () => (
        <>
            <form className="adminFilterCard" onSubmit={handleAdminProductsSearch}>
                <div className="adminField">
                    <label>검색어</label>
                    <input
                        type="text"
                        value={adminProductsKeyword}
                        onChange={(event) => {
                            setAdminProductsKeyword(event.target.value);
                            setAdminProductsPage(0);
                        }}
                        placeholder="상품명을 입력하세요"
                    />
                </div>
                <div className="adminField">
                    <label>판매 상태</label>
                    <select
                        value={adminProductsStatus}
                        onChange={handleAdminProductsFilterChange(setAdminProductsStatus)}
                    >
                        {productStatusOptions.map((option) => (
                            <option key={option.value || 'all-product-status'} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="adminField">
                    <label>카테고리</label>
                    <select
                        value={adminProductsCategoryId}
                        onChange={handleAdminProductsFilterChange(setAdminProductsCategoryId)}
                    >
                        {productCategoryOptions.map((option) => (
                            <option key={option.value || 'all-product-category'} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="adminPrimaryBtn">검색</button>
            </form>

            <section className="adminOpsSection">
                <div className="adminPanelHeader">
                    <div>
                        <h3>상품 목록</h3>
                        <p>총 {adminProductsTotalElements.toLocaleString()}개의 상품을 조회했습니다.</p>
                    </div>
                    <span>{adminProductsLoading ? '조회 중' : `${adminProductsPage + 1} / ${Math.max(adminProductsTotalPages, 1)}`}</span>
                </div>

                {adminProductsError && (
                    <div className="adminDashboardNotice">{adminProductsError}</div>
                )}

                {!adminProductsError && adminProductsLoading && (
                    <div className="adminDashboardNotice">상품 목록을 불러오는 중입니다.</div>
                )}

                {!adminProductsError && !adminProductsLoading && adminProducts.length === 0 && (
                    <div className="adminUsersEmpty">상품 데이터가 없습니다.</div>
                )}

                {!adminProductsError && adminProducts.length > 0 && (
                    <>
                        <AdminProductsTable products={adminProducts} />
                        <div className="adminPagination">
                            <button
                                type="button"
                                disabled={adminProductsPage <= 0 || adminProductsLoading}
                                onClick={() => setAdminProductsPage((page) => Math.max(page - 1, 0))}
                            >
                                이전
                            </button>
                            <span>{adminProductsPage + 1} / {Math.max(adminProductsTotalPages, 1)}</span>
                            <button
                                type="button"
                                disabled={adminProductsPage + 1 >= adminProductsTotalPages || adminProductsLoading}
                                onClick={() => setAdminProductsPage((page) => page + 1)}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </section>
        </>
    );

    const handleAdminOrdersSearch = (event) => {
        event.preventDefault();
        setAdminOrdersPage(0);
    };

    const handleAdminOrdersFilterChange = (setter) => (event) => {
        setter(event.target.value);
        setAdminOrdersPage(0);
    };

    const renderOrders = () => (
        <>
            <form className="adminFilterCard adminOrderFilterCard" onSubmit={handleAdminOrdersSearch}>
                <div className="adminField">
                    <label>검색어</label>
                    <input
                        type="text"
                        value={adminOrdersKeyword}
                        onChange={(event) => {
                            setAdminOrdersKeyword(event.target.value);
                            setAdminOrdersPage(0);
                        }}
                        placeholder="주문번호, 상품명, 구매자를 입력하세요"
                    />
                </div>
                <div className="adminField">
                    <label>주문 상태</label>
                    <select
                        value={adminOrdersStatus}
                        onChange={handleAdminOrdersFilterChange(setAdminOrdersStatus)}
                    >
                        {orderStatusOptions.map((option) => (
                            <option key={option.value || 'all-order-status'} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="adminField">
                    <label>시작일</label>
                    <input
                        type="date"
                        value={adminOrdersStartDate}
                        onChange={handleAdminOrdersFilterChange(setAdminOrdersStartDate)}
                    />
                </div>
                <div className="adminField">
                    <label>종료일</label>
                    <input
                        type="date"
                        value={adminOrdersEndDate}
                        onChange={handleAdminOrdersFilterChange(setAdminOrdersEndDate)}
                    />
                </div>
                <button type="submit" className="adminPrimaryBtn">검색</button>
            </form>

            <section className="adminOpsSection">
                <div className="adminPanelHeader">
                    <div>
                        <h3>주문 목록</h3>
                        <p>총 {adminOrdersTotalElements.toLocaleString()}건의 주문을 조회했습니다.</p>
                    </div>
                    <span>{adminOrdersLoading ? '조회 중' : `${adminOrdersPage + 1} / ${Math.max(adminOrdersTotalPages, 1)}`}</span>
                </div>

                {adminOrdersError && (
                    <div className="adminDashboardNotice">{adminOrdersError}</div>
                )}

                {!adminOrdersError && adminOrdersLoading && (
                    <div className="adminDashboardNotice">주문 목록을 불러오는 중입니다.</div>
                )}

                {!adminOrdersError && !adminOrdersLoading && adminOrders.length === 0 && (
                    <div className="adminUsersEmpty">주문 데이터가 없습니다.</div>
                )}

                {!adminOrdersError && adminOrders.length > 0 && (
                    <>
                        <AdminOrdersTable orders={adminOrders} />
                        <div className="adminPagination">
                            <button
                                type="button"
                                disabled={adminOrdersPage <= 0 || adminOrdersLoading}
                                onClick={() => setAdminOrdersPage((page) => Math.max(page - 1, 0))}
                            >
                                이전
                            </button>
                            <span>{adminOrdersPage + 1} / {Math.max(adminOrdersTotalPages, 1)}</span>
                            <button
                                type="button"
                                disabled={adminOrdersPage + 1 >= adminOrdersTotalPages || adminOrdersLoading}
                                onClick={() => setAdminOrdersPage((page) => page + 1)}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </section>
        </>
    );

    const handleAdminReviewsSearch = (event) => {
        event.preventDefault();
        setAdminReviewsPage(0);
    };

    const handleAdminReviewsFilterChange = (setter) => (event) => {
        setter(event.target.value);
        setAdminReviewsPage(0);
    };

    const renderReviews = () => (
        <>
            <form className="adminFilterCard adminReviewFilterCard" onSubmit={handleAdminReviewsSearch}>
                <div className="adminField">
                    <label>검색어</label>
                    <input
                        type="text"
                        value={adminReviewsKeyword}
                        onChange={(event) => {
                            setAdminReviewsKeyword(event.target.value);
                            setAdminReviewsPage(0);
                        }}
                        placeholder="상품명, 작성자를 입력하세요"
                    />
                </div>
                <div className="adminField">
                    <label>평점</label>
                    <select
                        value={adminReviewsRating}
                        onChange={handleAdminReviewsFilterChange(setAdminReviewsRating)}
                    >
                        {reviewRatingOptions.map((option) => (
                            <option key={option.value || 'all-review-rating'} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="adminField">
                    <label>시작일</label>
                    <input
                        type="date"
                        value={adminReviewsStartDate}
                        onChange={handleAdminReviewsFilterChange(setAdminReviewsStartDate)}
                    />
                </div>
                <div className="adminField">
                    <label>종료일</label>
                    <input
                        type="date"
                        value={adminReviewsEndDate}
                        onChange={handleAdminReviewsFilterChange(setAdminReviewsEndDate)}
                    />
                </div>
                <button type="submit" className="adminPrimaryBtn">검색</button>
            </form>

            <section className="adminOpsSection">
                <div className="adminPanelHeader">
                    <div>
                        <h3>리뷰 목록</h3>
                        <p>총 {adminReviewsTotalElements.toLocaleString()}건의 리뷰를 조회했습니다.</p>
                    </div>
                    <span>{adminReviewsLoading ? '조회 중' : `${adminReviewsPage + 1} / ${Math.max(adminReviewsTotalPages, 1)}`}</span>
                </div>

                {adminReviewsError && (
                    <div className="adminDashboardNotice">{adminReviewsError}</div>
                )}

                {!adminReviewsError && adminReviewsLoading && (
                    <div className="adminDashboardNotice">리뷰 목록을 불러오는 중입니다.</div>
                )}

                {!adminReviewsError && !adminReviewsLoading && adminReviews.length === 0 && (
                    <div className="adminUsersEmpty">리뷰 데이터가 없습니다.</div>
                )}

                {!adminReviewsError && adminReviews.length > 0 && (
                    <>
                        <AdminReviewsTable reviews={adminReviews} />
                        <div className="adminPagination">
                            <button
                                type="button"
                                disabled={adminReviewsPage <= 0 || adminReviewsLoading}
                                onClick={() => setAdminReviewsPage((page) => Math.max(page - 1, 0))}
                            >
                                이전
                            </button>
                            <span>{adminReviewsPage + 1} / {Math.max(adminReviewsTotalPages, 1)}</span>
                            <button
                                type="button"
                                disabled={adminReviewsPage + 1 >= adminReviewsTotalPages || adminReviewsLoading}
                                onClick={() => setAdminReviewsPage((page) => page + 1)}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </section>
        </>
    );

    const renderContent = () => {
        if (activeTab === 'dashboard') {
            return renderDashboard();
        }

        if (activeTab === 'members') {
            return renderMembers();
        }

        if (activeTab === 'products') {
            return renderProducts();
        }

        if (activeTab === 'orders') {
            return renderOrders();
        }

        if (activeTab === 'reviews') {
            return renderReviews();
        }

        if (activeTab === 'cscenter') {
            return renderCsCenter();
        }

        return (
            <>
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

function MetricCard({ label, value, basis, note = 'API 연결 후 표시' }) {
    return (
        <article className="adminMetricCard">
            <span>{label}</span>
            <strong>{value}</strong>
            {basis && <em>{basis}</em>}
            <p>{note}</p>
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

function AdminUsersTable({ users }) {
    return (
        <div className="adminUsersTable">
            <div className="adminUsersHead">
                <span>회원번호</span>
                <span>아이디</span>
                <span>이름</span>
                <span>연락처</span>
                <span>상태</span>
                <span>권한</span>
                <span>가입일</span>
                <span>수정일</span>
                <span>탈퇴일</span>
            </div>
            <div className="adminUsersBody">
                {users.map((user) => (
                    <div className="adminUsersRow" key={user.userNum ?? user.loginId}>
                        <span>{formatValue(user.userNum)}</span>
                        <span>{formatValue(user.loginId)}</span>
                        <span>{formatValue(user.userNm)}</span>
                        <span>{formatValue(user.tel)}</span>
                        <span>{formatCode(user.statusCd, statusCdOptions)}</span>
                        <span>{formatCode(user.roleCd, roleCdOptions)}</span>
                        <span>{formatDateTime(user.crtAt)}</span>
                        <span>{formatDateTime(user.updAt)}</span>
                        <span>{formatDateTime(user.wdDt)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminProductsTable({ products }) {
    return (
        <div className="adminProductsTable">
            <div className="adminProductsHead">
                <span>이미지</span>
                <span>상품번호</span>
                <span>상품명</span>
                <span>브랜드</span>
                <span>카테고리</span>
                <span>가격</span>
                <span>상태</span>
                <span>등록일</span>
                <span>수정일</span>
                <span>삭제일</span>
            </div>
            <div className="adminProductsBody">
                {products.map((product) => (
                    <div className="adminProductsRow" key={product.prdId ?? product.prdNm}>
                        <span>
                            {product.thumbImgUrl ? (
                                <img
                                    className="adminProductThumb"
                                    src={product.thumbImgUrl}
                                    alt={product.prdNm || '상품 이미지'}
                                    onError={(event) => {
                                        event.currentTarget.style.display = 'none';
                                    }}
                                />
                            ) : (
                                <span className="adminProductThumbEmpty">이미지 없음</span>
                            )}
                        </span>
                        <span>{formatValue(product.prdId)}</span>
                        <span>{formatValue(product.prdNm)}</span>
                        <span>{formatValue(product.brand)}</span>
                        <span>{formatValue(product.categoryName || formatCode(String(product.catCd ?? ''), productCategoryOptions))}</span>
                        <span>{formatCurrency(product.price)}</span>
                        <span>{formatCode(product.useYn, productStatusOptions)}</span>
                        <span>{formatDateTime(product.crtAt)}</span>
                        <span>{formatDateTime(product.updAt)}</span>
                        <span>{formatDateTime(product.wdAt)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminOrdersTable({ orders }) {
    return (
        <div className="adminOrdersTable">
            <div className="adminOrdersHead">
                <span>주문번호</span>
                <span>상품명</span>
                <span>구매자 ID</span>
                <span>구매자명</span>
                <span>결제금액</span>
                <span>상태</span>
                <span>주문일</span>
                <span>수정일</span>
            </div>
            <div className="adminOrdersBody">
                {orders.map((order) => (
                    <div className="adminOrdersRow" key={order.orderId ?? order.orderNo}>
                        <span>{formatValue(order.orderNo)}</span>
                        <span>{formatValue(order.productName)}</span>
                        <span>{formatValue(order.buyerId)}</span>
                        <span>{formatValue(order.buyerName)}</span>
                        <span>{formatCurrency(order.totalPrice)}</span>
                        <span>{formatCode(order.orderStatus, orderStatusOptions)}</span>
                        <span>{formatDateTime(order.createdAt)}</span>
                        <span>{formatDateTime(order.updatedAt)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdminReviewsTable({ reviews }) {
    return (
        <div className="adminReviewsTable">
            <div className="adminReviewsHead">
                <span>리뷰번호</span>
                <span>상품번호</span>
                <span>상품명</span>
                <span>작성자 ID</span>
                <span>작성자명</span>
                <span>평점</span>
                <span>내용</span>
                <span>표시여부</span>
                <span>작성일</span>
                <span>수정일</span>
            </div>
            <div className="adminReviewsBody">
                {reviews.map((review) => (
                    <div className="adminReviewsRow" key={review.reviewId ?? `${review.productId}-${review.writerId}`}>
                        <span>{formatValue(review.reviewId)}</span>
                        <span>{formatValue(review.productId)}</span>
                        <span>{formatValue(review.productName)}</span>
                        <span>{formatValue(review.writerId)}</span>
                        <span>{formatValue(review.writerName)}</span>
                        <span>{formatRating(review.rating)}</span>
                        <span className="adminReviewContent" title={formatValue(review.content)}>
                            {formatValue(review.content)}
                        </span>
                        <span>{formatCode(review.useYn, reviewUseYnOptions)}</span>
                        <span>{formatDateTime(review.createdAt)}</span>
                        <span>{formatDateTime(review.updatedAt)}</span>
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

function createDashboardData(summary) {
    if (!summary) {
        return dashboardPlaceholderData;
    }

    return {
        ...dashboardPlaceholderData,
        sales: {
            ...dashboardPlaceholderData.sales,
            status: 'summary API 반영',
            metrics: [
                {
                    ...dashboardPlaceholderData.sales.metrics[0],
                    value: formatCurrency(summary.todaySalesAmt, dashboardPlaceholderData.sales.metrics[0].value),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.sales.metrics[1],
                    value: formatCurrency(summary.monthSalesAmt, dashboardPlaceholderData.sales.metrics[1].value),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.sales.metrics[2],
                    value: formatCount(summary.todayPaidOrderCount, dashboardPlaceholderData.sales.metrics[2].value),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.sales.metrics[3],
                    value: summary.popularCategory?.catNm || dashboardPlaceholderData.sales.metrics[3].value,
                    note: 'summary API 기준'
                }
            ]
        },
        members: {
            ...dashboardPlaceholderData.members,
            metrics: [
                {
                    ...dashboardPlaceholderData.members.metrics[0],
                    value: formatCount(summary.memberStats?.totalCount, dashboardPlaceholderData.members.metrics[0].value, '명'),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.members.metrics[1],
                    value: formatCount(summary.memberStats?.activeCount, dashboardPlaceholderData.members.metrics[1].value, '명'),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.members.metrics[2],
                    value: formatCount(summary.memberStats?.withdrawnCount, dashboardPlaceholderData.members.metrics[2].value, '명'),
                    note: 'summary API 기준'
                }
            ]
        },
        inquiries: {
            ...dashboardPlaceholderData.inquiries,
            metrics: [
                {
                    ...dashboardPlaceholderData.inquiries.metrics[0],
                    value: formatCount(summary.inquiryStats?.waitingCount, dashboardPlaceholderData.inquiries.metrics[0].value),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.inquiries.metrics[1],
                    value: formatCount(summary.inquiryStats?.answeredCount, dashboardPlaceholderData.inquiries.metrics[1].value),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.inquiries.metrics[2],
                    value: formatCount(summary.inquiryStats?.todayNewCount, dashboardPlaceholderData.inquiries.metrics[2].value),
                    note: 'summary API 기준'
                },
                {
                    ...dashboardPlaceholderData.inquiries.metrics[3],
                    value: formatRate(summary.inquiryStats?.answerRate, dashboardPlaceholderData.inquiries.metrics[3].value),
                    note: 'summary API 기준'
                }
            ]
        },
        productSalesTop5: {
            ...dashboardPlaceholderData.productSalesTop5,
            rows: Array.isArray(summary.productSalesTop5)
                ? summary.productSalesTop5.map((item, index) => ({
                    rank: `${index + 1}`,
                    productName: item.prdNm || '-',
                    category: item.catNm || '-',
                    paidQuantity: formatCount(item.paidQty, '-', '개'),
                    salesAmount: formatCurrency(item.salesAmt, '-')
                }))
                : dashboardPlaceholderData.productSalesTop5.rows
        }
    };
}

function formatCurrency(value, fallback = '-') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
        return fallback;
    }

    return `${numberValue.toLocaleString()}원`;
}

function formatCount(value, fallback = '-', unit = '건') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
        return fallback;
    }

    return `${numberValue.toLocaleString()}${unit}`;
}

function formatRate(value, fallback = '-') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
        return fallback;
    }

    return `${numberValue}%`;
}

function formatValue(value, fallback = '-') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }

    return value;
}

function formatCode(value, options) {
    if (!value) {
        return '-';
    }

    return options.find((option) => option.value === value)?.label || value;
}

function formatRating(value) {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    return `${value}점`;
}

function formatDateTime(value) {
    if (!value) {
        return '-';
    }

    return String(value).replace('T', ' ').slice(0, 16);
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
