import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../../service/apiService';
import './MyReviewList.css';

export default function MyReviewList() {

    const navigate = useNavigate();

    // 내가 쓴 리뷰 목록
    const [rvwList, setRvwList] = useState([]);

    // 로딩 상태
    const [loading, setLoading] = useState(true);

    // 에러 메시지
    const [error, setError] = useState(null);

    // 수정 중인 리뷰 ID
    const [editRvwId, setEditRvwId] = useState(null);

    // 수정할 리뷰 내용
    const [editCmt, setEditCmt] = useState('');

    // 수정할 별점
    const [editRating, setEditRating] = useState(5);

    // 내가 쓴 리뷰 목록 조회
    async function fetchMyReviews() {
        try {
            setLoading(true);

            // 1. 내가 쓴 리뷰 목록 조회
            const data = await apiCall.get('/api/v1/rvw/user');

            // 2. 리뷰마다 상품 정보 추가 조회
            const reviewWithProduct = [];

            for (const rvw of data) {
                const prd = await apiCall.get(`/api/v1/product/detail/${rvw.prdId}`);

                reviewWithProduct.push({
                    ...rvw,
                    prdNm: prd.prdNm,
                    brand: prd.brand,
                    price: prd.price,
                    thumbImgUrl: prd.thumbImgUrl
                });
            }

            setRvwList(reviewWithProduct);

        } catch (err) {
            console.error('리뷰 목록 오류:', err);
            setError('리뷰 목록을 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMyReviews();
    }, []);

    // 수정 버튼 클릭
    function handleEditStart(e, rvw) {
        e.stopPropagation();

        setEditRvwId(rvw.rvwId);
        setEditCmt(rvw.cmt);
        setEditRating(rvw.rating);
    }

    // 수정 취소
    function handleEditCancel(e) {
        e.stopPropagation();

        setEditRvwId(null);
        setEditCmt('');
        setEditRating(5);
    }

    // 수정 완료
    async function handleEditSubmit(e, rvwId) {
        e.stopPropagation();

        try {
            await apiCall.patch(`/api/v1/rvw/${rvwId}`, {
                rating: editRating,
                cmt: editCmt
            });

            setEditRvwId(null);
            setEditCmt('');
            setEditRating(5);

            await fetchMyReviews();

        } catch (err) {
            console.error('리뷰 수정 실패:', err);
            alert('리뷰 수정에 실패했습니다.');
        }
    }

    // 리뷰 삭제
    async function handleDeleteRvw(e, rvwId) {
        e.stopPropagation();

        if (!window.confirm('리뷰를 삭제하시겠습니까?')) return;

        try {
            await apiCall.delete(`/api/v1/rvw/${rvwId}`);
            await fetchMyReviews();
        } catch (err) {
            console.error('리뷰 삭제 실패:', err);
            alert('리뷰 삭제에 실패했습니다.');
        }
    }

    // 상품 상세 이동
    function goProductDetail(e, prdId) {
        e.stopPropagation();
        navigate(`/products/detail/${prdId}`);
    }

    if (loading) {
        return <div className='rvw-loading'>로딩 중...</div>;
    }

    if (error) {
        return <div className='rvw-error'>{error}</div>;
    }

    return (
        <div className='rvw-wrap'>

            {/* 헤더 */}
            <div className='rvw-header'>
                <h2 className='rvw-title'>내가 쓴 리뷰</h2>
                <p className='rvw-count'>총 {rvwList.length}개</p>
            </div>

            {/* 리뷰 없을 때 */}
            {rvwList.length === 0 && (
                <div className='rvw-empty'>
                    <p>작성한 리뷰가 없습니다.</p>
                </div>
            )}

            {/* 리뷰 목록 */}
            <div className='rvw-list'>
                {rvwList.map((rvw) => (
                    <div
                        key={rvw.rvwId}
                        className='rvw-item'
                        onClick={() => {
                            if (editRvwId !== rvw.rvwId) {
                                navigate(`/mypage/myreview/${rvw.rvwId}`);
                            }
                        }}
                    >

                        {/* 상품 정보 */}
                        <div className='rvw-item__product'>
                            <div
                                className='rvw-item__img-box'
                                onClick={(e) => goProductDetail(e, rvw.prdId)}
                            >
                                <img
                                    className='rvw-item__img'
                                    src={rvw.thumbImgUrl || '/images/no-image.png'}
                                    alt={rvw.prdNm}
                                    onError={(e) => {
                                        e.target.src = '/images/no-image.png';
                                    }}
                                />
                            </div>

                            <div
                                className='rvw-item__prd-info'
                                onClick={(e) => goProductDetail(e, rvw.prdId)}
                            >
                                <p className='rvw-item__brand'>{rvw.brand}</p>
                                <h3 className='rvw-item__prdNm'>{rvw.prdNm}</h3>
                                <p className='rvw-item__price'>
                                    {rvw.price?.toLocaleString('ko-KR')}원
                                </p>
                            </div>
                        </div>

                        {/* 수정 모드 */}
                        {editRvwId === rvw.rvwId ? (
                            <div
                                className='rvw-edit-box'
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* 별점 수정 */}
                                <div className='rvw-edit-star'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setEditRating(star)}
                                            className={star <= editRating ? 'rvw-edit-star-on' : 'rvw-edit-star-off'}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>

                                {/* 리뷰 내용 수정 */}
                                <textarea
                                    className='rvw-edit-textarea'
                                    value={editCmt}
                                    onChange={(e) => setEditCmt(e.target.value)}
                                    rows={3}
                                />

                                <div className='rvw-edit-btns'>
                                    <button
                                        className='rvw-edit-submit'
                                        onClick={(e) => handleEditSubmit(e, rvw.rvwId)}
                                    >
                                        수정 완료
                                    </button>

                                    <button
                                        className='rvw-edit-cancel'
                                        onClick={handleEditCancel}
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* 별점 / 작성일 */}
                                <div className='rvw-item__top'>
                                    <span className='rvw-item__star'>
                                        {'★'.repeat(rvw.rating)}
                                        {'☆'.repeat(5 - rvw.rating)}
                                    </span>

                                    <span className='rvw-item__date'>
                                        {rvw.crtAt?.slice(0, 10)}
                                    </span>
                                </div>

                                {/* 리뷰 내용 */}
                                <p className='rvw-item__cmt'>{rvw.cmt}</p>

                                {/* 판매자 답변 */}
                                <div className='rvw-item__reply'>
                                    {rvw.replyTxt ? (
                                        <>
                                            <strong>판매자 답변:</strong>
                                            <p>{rvw.replyTxt}</p>
                                        </>
                                    ) : (
                                        <p className='rvw-item__reply-wait'>
                                            판매자 답변 대기중
                                        </p>
                                    )}
                                </div>

                                {/* 버튼 영역 */}
                                <div className='rvw-item__btns'>

                                    <button
                                        className='rvw-item__prd-btn'
                                        onClick={(e) => goProductDetail(e, rvw.prdId)}
                                    >
                                        상품 보기
                                    </button>

                                    <button
                                        className='rvw-item__edit-btn'
                                        onClick={(e) => handleEditStart(e, rvw)}
                                    >
                                        수정
                                    </button>

                                    <button
                                        className='rvw-item__delete-btn'
                                        onClick={(e) => handleDeleteRvw(e, rvw.rvwId)}
                                    >
                                        삭제
                                    </button>

                                </div>
                            </>
                        )}

                    </div>
                ))}
            </div>

        </div>
    );
}