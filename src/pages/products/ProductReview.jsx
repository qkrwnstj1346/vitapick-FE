import './ProductReview.css';
import { useState, useEffect } from 'react';
import { apiCall } from '../../service/apiService';
import Pagination from '../../components/layout/Pagination';

// 상품 리뷰 영역 컴포넌트
const ProductReview = ({ prdId }) => {

    // 리뷰 목록
    const [rvwList, setRvwList] = useState([]);

    // 새 리뷰 내용
    const [rvwTxt, setRvwTxt] = useState('');

    // 새 리뷰 별점
    const [rating, setRating] = useState(5);

    // 리뷰 작성 폼 열림 여부
    const [showRvwForm, setShowRvwForm] = useState(false);

    // 수정 중인 리뷰 ID
    const [editRvwId, setEditRvwId] = useState(null);

    // 수정할 리뷰 내용
    const [editRvwTxt, setEditRvwTxt] = useState('');

    // 수정할 별점
    const [editRating, setEditRating] = useState(5);

    // 현재 리뷰 페이지
    const [rvwPage, setRvwPage] = useState(1);

    // 한 페이지에 보여줄 리뷰 개수
    const rvwPageSize = 5;

    // 리뷰 목록 다시 가져오기
    const fetchRvwList = async () => {
        try {
            const data = await apiCall.get(`/api/v1/rvw/prd/${prdId}`);
            setRvwList(data);
        } catch (err) {
            console.error('리뷰 조회 오류:', err);
        }
    };

    // 상품 ID가 바뀔 때 리뷰 목록 가져오기
    useEffect(() => {
        fetchRvwList();

        // 다른 상품으로 이동하면 리뷰 페이지를 1페이지로 초기화
        setRvwPage(1);
    }, [prdId]);

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

            // 최신 리뷰가 보이도록 1페이지로 이동
            setRvwPage(1);

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

            // 삭제 후 1페이지로 이동
            setRvwPage(1);

            // 리뷰 목록 새로고침
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
        setEditRvwId(null);
        setEditRvwTxt('');
        setEditRating(5);
    };

    // 수정 완료
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

            // 리뷰 목록 새로고침
            await fetchRvwList();

        } catch (err) {
            console.error('리뷰 수정 실패:', err);
            console.error('상태코드:', err.response?.status);
            console.error('응답데이터:', err.response?.data);
            alert('리뷰 수정에 실패했습니다.');
        }
    };

    // 전체 리뷰 페이지 수
    const totalRvwPage = Math.ceil(rvwList.length / rvwPageSize);

    // 현재 페이지 시작 인덱스
    const startIndex = (rvwPage - 1) * rvwPageSize;

    // 현재 페이지 끝 인덱스
    const endIndex = startIndex + rvwPageSize;

    // 현재 페이지에서 보여줄 리뷰 목록
    const currentRvwList = rvwList.slice(startIndex, endIndex);

    return (
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

            {/* 현재 페이지 리뷰 목록 */}
            {currentRvwList.map((rvw, idx) => (
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

            {/* 리뷰 페이지네이션 */}
            {totalRvwPage > 1 && (
                <Pagination
                    currentPage={rvwPage}
                    totalPage={totalRvwPage}
                    onPageChange={setRvwPage}
                />
            )}

        </div>
    );
};

export default ProductReview;