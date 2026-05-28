import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiCall, getToken, getLocalData } from '../../../service/apiService';
import './MyReviewList.css';

export default function MyReviewList() {

    const navigate = useNavigate();
    const userInfo = getLocalData('userInfo');
    const token = getToken();

    const [rvwList, setRvwList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userInfo?.userNum) {
            alert('로그인이 필요합니다.');
            navigate('/v1/auth/login');
            return;
        }

        apiCall(`/api/v1/rvw/user/${userInfo.userNum}`, 'GET', null, token, false)
            .then(data => setRvwList(data))
            .catch(err => {
                console.error('리뷰 목록 오류:', err);
                setError('리뷰 목록을 불러오지 못했습니다.');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className='rvw-loading'>로딩 중...</div>;
    if (error) return <div className='rvw-error'>{error}</div>;

    return (
        <div className='rvw-wrap'>

            {/* 헤더 */}
            <div className='rvw-header'>
                <h2 className='rvw-title'>내가 쓴 리뷰</h2>
                <p className='rvw-count'>총 {rvwList.length}개</p>
            </div>

            {/* 리뷰 없을때 */}
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
                        onClick={() => navigate(`/mypage/myreview/${rvw.rvwId}`)}
                    >
                        {/* 별점 */}
                        <div className='rvw-item__top'>
                            <span className='rvw-item__star'>
                                {'★'.repeat(rvw.rating)}{'☆'.repeat(5 - rvw.rating)}
                            </span>
                            <span className='rvw-item__date'>{rvw.crtAt?.slice(0, 10)}</span>
                        </div>

                        {/* 리뷰 내용 */}
                        <p className='rvw-item__cmt'>{rvw.cmt}</p>

                        {/* 상품으로 이동 버튼 */}
                        <button
                            className='rvw-item__prd-btn'
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/products/detail/${rvw.prdId}`);
                            }}
                        >
                            상품 보기 →
                        </button>

                    </div>
                ))}
            </div>

        </div>
    );
}