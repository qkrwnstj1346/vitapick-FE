import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../../service/apiService';
import './ProductDetail.css';


const ProductDetail = () => {

    const { prdId } = useParams(); // URL에서 상품ID 가져오기
    const navigate = useNavigate(); // 페이지 이동 함수
    const [prd, setPrd] = useState(null);// 상품 정보
    const [loading, setLoading] = useState(true); // 상품 정보 로딩 상태
    const [activeTab, setActiveTab] = useState('desc'); //  desc: 상품설명, rvw: 상품평
    const [wished, setWished] = useState(false); // 찜 여부
    const [quantity, setQuantity] = useState(1); // 구매 수량
    const [descExpanded, setDescExpanded] = useState(false); // 상품설명 확장 여부
    const [rvwList, setRvwList] = useState([]);      // 리뷰 목록
    const [rvwTxt, setRvwTxt] = useState('');         // 리뷰 입력 내용
    const [rating, setRating] = useState(5);          // 별점
    const [showRvwForm, setShowRvwForm] = useState(false); // 작성폼 열림/닫힘

   
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = (await apiCall.get(`/api/v1/product/detail/${prdId}`)).data;
                setPrd(data);
            } catch (err) {
                console.error('상품 상세 오류:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [prdId]);

    // 리뷰 목록 가져오기
    useEffect(() => {
        const fetchRvw = async () => {
            try {
                const data = (await apiCall.get(`/api/v1/rvw/prd/${prdId}`)).data;
                setRvwList(data);
            } catch (err) {
                console.error('리뷰 조회 오류:', err);
            }
        };
        fetchRvw();
    }, [prdId]);



    if (loading) return <div className='detail_loading'>로딩 중...</div>;
    if (!prd) return <div className='detail_loading'>상품을 찾을 수 없습니다.</div>;

    return (
        <div className='detail_container'>

            {/* 상단 상품 정보 */}
            <div className='detail_top'>

                {/* 상품 이미지 */}
                <div className='detail_img_box'>
                    <img src={prd.thumbImgUrl} alt={prd.prdNm} />
                </div>

                {/* 상품 정보 */}
                <div className='detail_info'>
                    <p className='detail_brand'>{prd.brand}</p>
                    <h2 className='detail_nm'>{prd.prdNm}</h2>
                    <strong className='detail_price'>{prd.price.toLocaleString()}원</strong>

                    <div className='detail_btns'>

                        {/* 장바구니 버튼 */}
                        <button className='detail_cart_btn' onClick={async () => {
                            await apiCall.post('/cart', {
                                userNum: sessionStorage.getItem("userNum"),
                                prdId: Number(prdId),
                                itQty: quantity,
                                selectedYn: 'Y'
                            });
                            // 장바구니 담기 후 이동 여부 확인
                            const go = window.confirm('장바구니에 담았습니다!\n장바구니로 이동하시겠습니까?');
                            if (go) navigate('/cart');
                        }}>
                            장바구니 담기
                        </button>

                        {/* 구매하기 버튼 */}
                            <button className='detail_buy_btn'>
                                바로 구매하기
                            </button>

                        

                        {/* 찜하기 버튼 */}
                        <button
                            className={`detail_wish_btn ${wished ? 'wished' : ''}`}
                            onClick={() => setWished(prev => !prev)}
                        >
                            {wished ? '♥ 찜완료' : '♡ 찜하기'}
                        </button>

                    </div>
                </div>

            </div>

            {/* 탭 */}
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

            {/* 탭 내용 */}
            <div className='detail_tab_content'>

                {/* 상품설명 */}
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

                {/* 상품평 */}
                {activeTab === 'rvw' && (
                    <div className='detail_rvw'>

                        {/* 평균 평점 */}
                        <div className='rvw_summary'>
                            <strong>⭐ {rvwList.length > 0 ? 
                            (rvwList.reduce((sum, r) => sum + r.rating, 0) / rvwList.length).toFixed(1) : 0} / 5.0</strong>
                            <p>총 {rvwList.length}개의 리뷰</p>
                        </div>

                        {/* 리뷰 작성 버튼 */}
                        <button className='rvw_write_btn' onClick={() => setShowRvwForm(prev => !prev)}>
                            리뷰 작성하기
                        </button>

                        {/* 리뷰 작성 폼 */}
                        {showRvwForm && (
                        <div className='rvw_form'>

                        {/* 별점 선택 */}
                        <div className='rvw_rating_select'>
                            <p>별점 선택:</p>
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: 'pointer', color: star <= rating ? '#FFD700' : '#ddd', fontSize: '24px' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        {/* 리뷰 내용 입력 */}
                        <textarea
                            className='rvw_textarea'
                            value={rvwTxt}
                            onChange={(e) => setRvwTxt(e.target.value)}
                            placeholder='리뷰를 작성해주세요'
                            rows={4}
                        />

                        {/* 작성 완료 버튼 */}
                        <button className='rvw_submit_btn' onClick={async () => {
                            await apiCall.post('/api/v1/rvw', {
                                userNum: sessionStorage.getItem("userNum"),
                                ordItId: 1,
                                prdId: Number(prdId),
                                rating: rating,
                                cmt: rvwTxt
                            });
                            setRvwTxt('');
                            setShowRvwForm(false);
                            const data = (await apiCall.get(`/api/v1/rvw/prd/${prdId}`)).data;
                            setRvwList(data);
                        }}>
                            작성 완료
                        </button>

                    </div>
                )}

                        {/* 리뷰 없을때 */}
                        {rvwList.length === 0 && <p className='rvw_empty'>아직 작성된 리뷰가 없습니다.</p>}

                        {/* 리뷰 목록 */}
                        {rvwList.map((rvw, idx) => (
                            <div key={idx} className='rvw_item'>
                                <span className='rvw_star'>{'★'.repeat(rvw.rating)}{'☆'.repeat(5 - rvw.rating)}</span>
                                <span className='rvw_date'>{rvw.crtAt?.slice(0, 10)}</span>
                                <p className='rvw_cmt'>{rvw.cmt}</p>
                            </div>
                        ))}

                    </div>
                )}

            </div>

        </div>
    )};
export default ProductDetail;