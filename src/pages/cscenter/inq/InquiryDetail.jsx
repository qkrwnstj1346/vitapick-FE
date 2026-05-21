import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    getInqDetail,
    getMyInqDetail,
    deleteInq,
    updateInq,
    answerInq
} from '../../../service/cscenter/csCenterApi';

import './InquiryDetail.css';

function InquiryDetail() {

    const { inqId } = useParams();

    const navigate = useNavigate();

    const [inquiry, setInquiry] = useState(null);

    const [answerText, setAnswerText] = useState('');

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));

    const isAdmin = loginUser?.roleCd === 'ADMIN';

    useEffect(() => {

        fetchInquiryDetail();

    }, []);

    const fetchInquiryDetail = async () => {

        try {

            const response = isAdmin
                ? await getInqDetail(inqId)
                : await getMyInqDetail(inqId, loginUser.userNum);

            setInquiry(response.data);

            if (response.data?.ansTxt) {

                setAnswerText(response.data.ansTxt);

            }

        } catch (error) {

            console.log(error);

            alert('문의 상세 조회에 실패했습니다.');
        }
    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm('문의를 삭제하시겠습니까?');

        if (!confirmDelete) return;

        try {

            await deleteInq(inqId, loginUser.userNum);

            alert('문의가 삭제되었습니다.');

            navigate('/mypage/inquiries');

        } catch (error) {

            console.log(error);

            alert('문의 삭제에 실패했습니다.');
        }
    };

    const handleAnswerSubmit = async () => {

        if (!answerText.trim()) {

            alert('답변 내용을 입력해주세요.');

            return;
        }

        try {

            await answerInq(inqId, answerText);

            alert('답변이 등록되었습니다.');

            fetchInquiryDetail();

        } catch (error) {

            console.log(error);

            alert('답변 등록에 실패했습니다.');
        }
    };

    if (!inquiry) {

        return <div>로딩중...</div>;
    }

    return (
        <div className="inq-detail-wrap">

            <div className="inq-detail-top">

                <h2 className="inq-detail-title">
                    1:1 문의 상세
                </h2>

            </div>

            <table className="inq-detail-table">

                <tbody>

                    <tr>

                        <th>문의 유형</th>

                        <td>{inquiry.inqTpCd}</td>

                    </tr>

                    <tr>

                        <th>제목</th>

                        <td>{inquiry.ttl}</td>

                    </tr>

                    <tr>

                        <th>작성자</th>

                        <td>{inquiry.userNm || '회원'}</td>

                    </tr>

                    <tr>

                        <th>작성일</th>

                        <td>
                            {inquiry.crtAt?.substring(0, 10)}
                        </td>

                    </tr>

                    <tr>

                        <th>문의 내용</th>

                        <td className="inq-detail-content">
                            {inquiry.inqTxt}
                        </td>

                    </tr>

                </tbody>

            </table>

            {/* 관리자 답변 조회 */}
            {inquiry.ansTxt && (

                <div className="inq-answer-box">

                    <div className="inq-answer-header">
                        관리자 답변
                    </div>

                    <div className="inq-answer-body">
                        {inquiry.ansTxt}
                    </div>

                </div>

            )}

            {/* 관리자 답변 등록 */}
            {isAdmin && (

                <div className="inq-comment-form">

                    <h3 className="inq-comment-title">
                        답변 작성
                    </h3>

                    <textarea
                        className="inq-comment-textarea"
                        placeholder="답변 내용을 입력해주세요."
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                    />

                    <div className="inq-comment-btn-wrap">

                        <button
                            className="inq-comment-submit-btn"
                            onClick={handleAnswerSubmit}
                        >
                            답변 등록
                        </button>

                    </div>

                </div>

            )}

            <div className="inq-detail-bottom">

                {/* 일반 회원 본인 글 */}
                {!isAdmin && loginUser?.userNum === inquiry.userNum && (

                    <>
                        <button
                            className="inq-edit-btn"
                            onClick={() =>
                                navigate(`/inquiries/edit/${inqId}`)
                            }
                        >
                            수정
                        </button>

                        <button
                            className="inq-delete-btn"
                            onClick={handleDelete}
                        >
                            삭제
                        </button>
                    </>

                )}

                <button
                    className="inq-list-btn"
                    onClick={() => navigate(-1)}
                >
                    목록
                </button>

            </div>

        </div>
    );
}

export default InquiryDetail;