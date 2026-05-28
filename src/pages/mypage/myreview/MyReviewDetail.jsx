import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall, getToken } from '../../../service/apiService';
import './MyReviewDetail.css';

export default function MyReviewDetail() {

    const { rvwId } = useParams();
    const navigate = useNavigate();
    const token = getToken();

    const [rvw, setRvw] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        apiCall(`/api/v1/rvw/${rvwId}`, 'GET', null, token, false)
            .then(data => setRvw(data))
            .catch(err => {
                console.error('리뷰 상세 오류:', err);
                setError('리뷰를 불러오지 못했습니다.');
            })
            .finally(() => setLoading(false));
    }, [rvwId]);

    if (loading) return <div className='rvw-detail-loading'>로딩 중...</div>;
    if (error) return <div className='rvw-detail-error'>{error}</div>;

    return (
        <div className='rvw-detail-wrap'>

            {/* 헤더 */}
            <div className='rvw-detail-header'>
                <button className='rvw-detail-back' onClick={() => navigate(-1)}>← 뒤로가기</button>
                <h2 className='rvw-detail-title'>리뷰 상세</h2>
            </div>

            {/* 리뷰 내용 */}
            <div className='rvw-detail-card'>

                {/* 별점 */}
                <div className='rvw-detail-star'>
                    {'★'.repeat(rvw.rating)}{'☆'.repeat(5 - rvw.rating)}
                </div>

                {/* 날짜 */}
                <p className='rvw-detail-date'>{rvw.crtAt?.slice(0, 10)}</p>

                {/* 리뷰 내용 */}
                <p className='rvw-detail-cmt'>{rvw.cmt}</p>

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