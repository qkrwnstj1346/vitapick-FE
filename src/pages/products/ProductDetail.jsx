import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall, getToken } from '../../service/apiService';
import './ProductDetail.css';
import Pagination from '../../components/layout/Pagination';

const ProductDetail = () => {

    const { prdId } = useParams();

    const [prd, setPrd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('desc');
    const [wished, setWished] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [descExpanded, setDescExpanded] = useState(false);

    const [rvwList, setRvwList] = useState([]);
    const [rvwTxt, setRvwTxt] = useState('');
    const [rating, setRating] = useState(5);
    const [showRvwForm, setShowRvwForm] = useState(false);

    // 리뷰 페이지네이션
    const [rvwPage, setRvwPage] = useState(1);
    const reviewsPerPage = 5;

    // 상품 상세 조회
    useEffect(() => {
        const fetchProduct = async () => {
            const token = getToken();

            try {
                const data = await apiCall(`/api/v1/product/detail/${prdId}`, 'GET', null, token, false);
                setPrd(data);
            } catch (err) {
                console.error('상품 상세 오류:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [prdId]);

    // 리뷰 목록 조회
    useEffect(() => {
        const fetchRvw = async () => {
            const token = getToken();

            try {
                const data = await apiCall(`/api/v1/rvw/prd/${prdId}`, 'GET', null, token, false);
                setRvwList(Array.isArray(data) ? data : []);
                setRvwPage(1);
            } catch (err) {
                console.error('리뷰 조회 오류:', err);
            }
        };

        fetchRvw();
    }, [prdId]);

    // 리뷰 작성
    const handleSubmitReview = async () => {
        const token = getToken();

        if (!rvwTxt.trim()) {
            alert('리뷰를 작성해주세요.');
            return;
        }

        try {
            await apiCall('/api/v1/rvw', 'POST', {
                userNum: 1,
                ordItId: 1,
                prdId: Number(prdId),
                rating: rating,
                cmt: rvwTxt
            }, token, false);

            setRvwTxt('');
            setRating(5);
            setShowRvwForm(false);

            const data = await apiCall(`/api/v1/rvw/prd/${prdId}`, 'GET', null, token, false);
            setRvwList(Array.isArray(data) ? data : []);
            setRvwPage(1);
        } catch (err) {
            console.error('리뷰 작성 오류:', err);
            alert('리뷰 작성에 실패했습니다.');
        }
    };

    if (loading) {
        return <div className='detail_loading'>로딩 중...</div>;
    }

    if (!prd) {
        return <div className='detail_loading'>상품을 찾을 수 없습니다.</div>;
    }

    // 현재 페이지에 보여줄 리뷰만 자르기
    const totalRvwPages = Math.ceil(rvwList.length / reviewsPerPage);
    const startIdx = (rvwPage - 1) * reviewsPerPage;
    const currentRvwList = rvwList.slice(startIdx, startIdx + reviewsPerPage);

    return (
        <div className='detail_container'>

            <div className='detail_top'>

                <div className='detail_img_box'>
                    <img src={prd.thumbImgUrl} alt={prd.prdNm} />
                </div>

                <div className='detail_info'>
                    <p className='detail_brand'>{prd.brand}</p>
                    <h2 className='detail_nm'>{prd.prdNm}</h2>
                    <strong className='detail_price'>{prd.price.toLocaleString()}원</strong>

                    <div className='detail_btns'>
                        <button className='detail_cart_btn'>
                            장바구니 담기
                        </button>

                        <button className='detail_buy_btn'>
                            바로 구매하기
                        </button>

                        <button
                            className={`detail_wish_btn ${wished ? 'wished' : ''}`}
                            onClick={() => setWished(prev => !prev)}
                        >
                            {wished ? '♥ 찜완료' : '♡ 찜하기'}
                        </button>
                    </div>
                </div>

            </div>

            <div className='detail_tabs'>
                <button
                    className={activeTab === 'desc' ? 'tab_active' : ''}
                    onClick={() => setActiveTab('desc')}
                >
                    상품설명
                </button>

                <button
                    className={activeTab === 'rvw' ? 'tab_active' : ''}
                    onClick={() => setActiveTab('rvw')}
                >
                    상품평
                </button>
            </div>

            <div className='detail_tab_content'>

                {activeTab === 'desc' && (
                    <div className={`detail_desc ${descExpanded ? 'expanded' : ''}`}>
                        <img src={prd.detailImgUrl} alt='상품설명' />

                        {!descExpanded ? (
                            <div className='detail_desc_more'>
                                <button onClick={() => setDescExpanded(true)}>
                                    상품설명 더보기 ∨
                                </button>
                            </div>
                        ) : (
                            <div className='detail_desc_close'>
                                <button onClick={() => setDescExpanded(false)}>
                                    상품설명 접기 ∧
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'rvw' && (
                    <div className='detail_rvw'>

                        {/* 평균 평점 */}
                        <div className='rvw_summary'>
                            <strong>
                                ⭐ {rvwList.length > 0
                                    ? (rvwList.reduce((sum, r) => sum + r.rating, 0) / rvwList.length).toFixed(1)
                                    : 0} / 5.0
                            </strong>

                            <p>총 {rvwList.length}개의 리뷰</p>
                        </div>

                        {/* 리뷰 작성 버튼 */}
                        <button
                            className='rvw_write_btn'
                            onClick={() => setShowRvwForm(prev => !prev)}
                        >
                            리뷰 작성하기
                        </button>

                        {/* 리뷰 작성 폼 */}
                        {showRvwForm && (
                            <div className='rvw_form'>

                                <div className='rvw_rating_select'>
                                    <p>별점 선택:</p>

                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            onClick={() => setRating(star)}
                                            style={{
                                                cursor: 'pointer',
                                                color: star <= rating ? '#FFD700' : '#ddd',
                                                fontSize: '24px'
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                <textarea
                                    className='rvw_textarea'
                                    value={rvwTxt}
                                    onChange={(e) => setRvwTxt(e.target.value)}
                                    placeholder='리뷰를 작성해주세요'
                                    rows={4}
                                />

                                <button
                                    className='rvw_submit_btn'
                                    onClick={handleSubmitReview}
                                >
                                    작성 완료
                                </button>

                            </div>
                        )}

                        {/* 리뷰 없을 때 */}
                        {rvwList.length === 0 && (
                            <p className='rvw_empty'>
                                아직 작성된 리뷰가 없습니다.
                            </p>
                        )}

                        {/* 현재 페이지 리뷰 목록 */}
                        {currentRvwList.map((rvw, idx) => (
                            <div key={startIdx + idx} className='rvw_item'>
                                <span className='rvw_star'>
                                    {'★'.repeat(rvw.rating)}
                                    {'☆'.repeat(5 - rvw.rating)}
                                </span>

                                <span className='rvw_date'>
                                    {rvw.crtAt?.slice(0, 10)}
                                </span>

                                <p className='rvw_cmt'>
                                    {rvw.cmt}
                                </p>
                            </div>
                        ))}

                        {/* 페이지 버튼 */}
                        <Pagination
                            currentPage={rvwPage}
                            totalPage={totalRvwPages}
                            onPageChange={setRvwPage}
                        />

                    </div>
                )}

            </div>

        </div>
    );
};

export default ProductDetail;