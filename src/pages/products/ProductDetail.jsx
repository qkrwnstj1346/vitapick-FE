import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCall } from '../../service/apiService';
import './ProductDetail.css';

const ProductDetail = () => {

    // URL에서 상품 ID 가져오기
    const { prdId } = useParams();

    // 페이지 이동 함수
    const navigate = useNavigate();

    // 상품 상세 정보
    const [prd, setPrd] = useState(null);

    // 로딩 상태
    const [loading, setLoading] = useState(true);

    // 현재 탭 상태: desc = 상품설명, rvw = 상품평
    const [activeTab, setActiveTab] = useState('desc');

    // 찜 여부
    const [wished, setWished] = useState(false);

    // 구매 수량
    const [quantity, setQuantity] = useState(1);

    // 상품설명 더보기 여부
    const [descExpanded, setDescExpanded] = useState(false);

    // 리뷰 목록
    const [rvwList, setRvwList] = useState([]);

    // 새 리뷰 내용
    const [rvwTxt, setRvwTxt] = useState('');

    // 새 리뷰 별점
    const [rating, setRating] = useState(5);

    // 리뷰 작성 폼 열림 여부
    const [showRvwForm, setShowRvwForm] = useState(false);

    // 지금 수정 중인 리뷰 ID
    const [editRvwId, setEditRvwId] = useState(null);

    // 수정할 리뷰 내용
    const [editRvwTxt, setEditRvwTxt] = useState('');

    // 수정할 별점
    const [editRating, setEditRating] = useState(5);

    // 리뷰 목록 다시 가져오기
    const fetchRvwList = async () => {
        const data = await apiCall.get(`/api/v1/rvw/prd/${prdId}`);
        setRvwList(data);
    };

    // 리뷰 작성
    const handleSubmitRvw = async () => {
        try {
            await apiCall.post('/api/v1/rvw', {
                ordItId: 1,
                prdId: Number(prdId),
                rating: rating,
                cmt: rvwTxt
            });

            // 작성 후 입력값 초기화
            setRvwTxt('');
            setRating(5);

            // 작성 폼 닫기
            setShowRvwForm(false);

            // 리뷰 목록 새로고침
            await fetchRvwList();

        } catch (err) {
            console.error('리뷰 작성 실패:', err);
            console.error('상태코드:', err.response?.status);
            console.error('응답데이터:', err.response?.data);
            alert('리뷰 작성에 실패했습니다.');
        }
    };

    // 리뷰 삭제
    const handleDeleteRvw = async (rvwId) => {
        if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;

        try {
            // 백엔드에서 useYn = N 처리
            await apiCall.patch(`/api/v1/rvw/${rvwId}/cancel`);

            // 삭제 후 목록 다시 조회
            await fetchRvwList();

        } catch (err) {
            console.error('리뷰 삭제 실패:', err);
            console.error('상태코드:', err.response?.status);
            console.error('응답데이터:', err.response?.data);
            alert('리뷰 삭제에 실패했습니다.');
        }
    };

    // 수정 버튼 클릭 시 실행
    const handleEditRvw = (rvw) => {
        // 어떤 리뷰를 수정 중인지 저장
        setEditRvwId(rvw.rvwId);

        // 기존 리뷰 내용을 수정창에 넣기
        setEditRvwTxt(rvw.cmt);

        // 기존 별점을 수정 별점에 넣기
        setEditRating(rvw.rating);
    };

    // 수정 취소
    const handleCancelEdit = () => {
        // 수정 상태 초기화
        setEditRvwId(null);
        setEditRvwTxt('');
        setEditRating(5);
    };

    // 수정 완료 버튼 클릭 시 실행
    const handleUpdateRvw = async (rvwId) => {
        try {
            await apiCall.patch(`/api/v1/rvw/${rvwId}`, {
                rating: editRating,
                cmt: editRvwTxt
            });

            // 수정 상태 초기화
            setEditRvwId(null);
            setEditRvwTxt('');
            setEditRating(5);

            // 수정 후 리뷰 목록 다시 조회
            await fetchRvwList();

        } catch (err) {
            console.error('리뷰 수정 실패:', err);
            console.error('상태코드:', err.response?.status);
            console.error('응답데이터:', err.response?.data);
            alert('리뷰 수정에 실패했습니다.');
        }
    };

    // 상품 상세 정보 가져오기
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await apiCall.get(`/api/v1/product/detail/${prdId}`);
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
        fetchRvwList();
    }, [prdId]);

    // 로딩 중 화면
    if (loading) return <div className='detail_loading'>로딩 중...</div>;

    // 상품이 없을 때 화면
    if (!prd) return <div className='detail_loading'>상품을 찾을 수 없습니다.</div>;

    return (
        <div className='detail_container'>

            {/* 상단 상품 정보 */}
            <div className='detail_top'>

                {/* 상품 이미지 */}
                <div className='detail_img_box'>
                    <img src={prd.thumbImgUrl} alt={prd.prdNm} />
                </div>

                {/* 상품 기본 정보 */}
                <div className='detail_info'>
                    <p className='detail_brand'>{prd.brand}</p>
                    <h2 className='detail_nm'>{prd.prdNm}</h2>
                    <strong className='detail_price'>{prd.price.toLocaleString()}원</strong>

                    <div className='detail_btns'>

                        {/* 장바구니 버튼 */}
                        <button
                            className='detail_cart_btn'
                            onClick={async () => {
                                await apiCall.post('/cart', {
                                    userNum: sessionStorage.getItem('userNum'),
                                    prdId: Number(prdId),
                                    itQty: quantity,
                                    selectedYn: 'Y'
                                });

                                const go = window.confirm('장바구니에 담았습니다!\n장바구니로 이동하시겠습니까?');

                                if (go) {
                                    navigate('/cart');
                                }
                            }}
                        >
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

            {/* 탭 버튼 */}
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

                {/* 상품설명 탭 */}
                {activeTab === 'desc' && (
                    <div className={`detail_desc ${descExpanded ? 'expanded' : ''}`}>

                        {/* 상품 상세 이미지 */}
                        <img src={prd.detailImgUrl} alt='상품설명' />

                        {/* 상품설명 더보기 / 접기 */}
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

                {/* 상품평 탭 */}
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

                                {/* 새 리뷰 별점 선택 */}
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

                                {/* 새 리뷰 내용 */}
                                <textarea
                                    className='rvw_textarea'
                                    value={rvwTxt}
                                    onChange={(e) => setRvwTxt(e.target.value)}
                                    placeholder='리뷰를 작성해주세요'
                                    rows={4}
                                />

                                {/* 리뷰 작성 완료 */}
                                <button
                                    className='rvw_submit_btn'
                                    onClick={handleSubmitRvw}
                                >
                                    작성 완료
                                </button>
                            </div>
                        )}

                        {/* 리뷰 없을 때 */}
                        {rvwList.length === 0 && (
                            <p className='rvw_empty'>아직 작성된 리뷰가 없습니다.</p>
                        )}

                        {/* 리뷰 목록 */}
                        {rvwList.map((rvw, idx) => (
                            <div key={idx} className='rvw_item'>

                                {/* 수정 중인 리뷰라면 수정 폼 보여주기 */}
                                {editRvwId === rvw.rvwId ? (
                                    <div className='rvw_edit_form'>

                                        {/* 수정 별점 선택 */}
                                        <div className='rvw_rating_select'>
                                            <p>별점 수정:</p>

                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span
                                                    key={star}
                                                    onClick={() => setEditRating(star)}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: star <= editRating ? '#FFD700' : '#ddd',
                                                        fontSize: '24px'
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>

                                        {/* 수정 리뷰 내용 */}
                                        <textarea
                                            className='rvw_textarea'
                                            value={editRvwTxt}
                                            onChange={(e) => setEditRvwTxt(e.target.value)}
                                            rows={3}
                                        />

                                        {/* 수정 완료 버튼 */}
                                        <button
                                            className='rvw_submit_btn'
                                            onClick={() => handleUpdateRvw(rvw.rvwId)}
                                        >
                                            수정 완료
                                        </button>

                                        {/* 수정 취소 버튼 */}
                                        <button
                                            className='rvw_cancel_btn'
                                            onClick={handleCancelEdit}
                                        >
                                            취소
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* 기존 별점 표시 */}
                                        <span className='rvw_star'>
                                            {'★'.repeat(rvw.rating)}
                                            {'☆'.repeat(5 - rvw.rating)}
                                        </span>

                                        {/* 작성일 */}
                                        <span className='rvw_date'>
                                            {rvw.crtAt?.slice(0, 10)}
                                        </span>

                                        {/* 리뷰 내용 */}
                                        <p className='rvw_cmt'>{rvw.cmt}</p>

                                        {/* 본인 리뷰일 때만 수정 / 삭제 버튼 표시 */}
                                        {String(rvw.userNum) === sessionStorage.getItem('userNum') && (
                                            <>
                                                <button
                                                    className='rvw_edit_btn'
                                                    onClick={() => handleEditRvw(rvw)}
                                                >
                                                    수정
                                                </button>

                                                <button
                                                    className='rvw_delete_btn'
                                                    onClick={() => handleDeleteRvw(rvw.rvwId)}
                                                >
                                                    삭제
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetail;