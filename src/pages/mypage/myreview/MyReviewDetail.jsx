import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '../../../service/apiService';
import './MyReviewDetail.css';

export default function MyReviewDetail() {

    // URL에서 리뷰 ID 가져오기
    const { rvwId } = useParams();

    // 페이지 이동 함수
    const navigate = useNavigate();

    // 리뷰 상세 정보
    const [rvw, setRvw] = useState(null);

    // 로딩 상태
    const [loading, setLoading] = useState(true);

    // 에러 메시지
    const [error, setError] = useState(null);

    // 리뷰 상세 조회
    useEffect(() => {
        const fetchReviewDetail = async () => {
            try {
                const data = await apiCall.get(`/api/v1/rvw/${rvwId}`);
                setRvw(data);
            } catch (err) {
                console.error('리뷰 상세 오류:', err);
                setError('리뷰를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchReviewDetail();
    }, [rvwId]);

    if (loading) return <div className='rvw-detail-loading'>로딩 중...</div>;
    if (error) return <div className='rvw-detail-error'>{error}</div>;
    if (!rvw) return <div className='rvw-detail-error'>리뷰가 없습니다.</div>;

    return (
        <div className='rvw-detail-wrap'>

            {/* 헤더 */}
            <div className='rvw-detail-header'>
                <button
                    className='rvw-detail-back'
                    onClick={() => navigate(-1)}
                >
                    ← 뒤로가기
                </button>

                <h2 className='rvw-detail-title'>리뷰 상세</h2>
            </div>

            {/* 리뷰 내용 */}
            <div className='rvw-detail-card'>

                {/* 별점 */}
                <div className='rvw-detail-star'>
                    {'★'.repeat(rvw.rating)}
                    {'☆'.repeat(5 - rvw.rating)}
                </div>

                {/* 날짜 */}
                <p className='rvw-detail-date'>
                    {rvw.crtAt?.slice(0, 10)}
                </p>

                {/* 리뷰 내용 */}
                <p className='rvw-detail-cmt'>
                    {rvw.cmt}
                </p>

                {/* 관리자 답글이 있으면 표시 */}
                {rvw.replyTxt && (
                    <div className='rvw-detail-reply'>
                        <strong>관리자 답변</strong>
                        <p>{rvw.replyTxt}</p>
                    </div>
                )}

                {/* 상품 보기 버튼 */}
                <button
                    className='rvw-detail-prd-btn'
                    onClick={() => navigate(`/products/detail/${rvw.prdId}`)}
                >
                    상품 보기 →
                </button>

            </div>

        </div>
    );
}