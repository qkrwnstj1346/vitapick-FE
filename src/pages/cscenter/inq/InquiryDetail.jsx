import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    getInqDetail,
    getMyInqDetail,
    deleteInq,
    answerInq
} from '../../../service/cscenter/csCenterApi';

import './InquiryDetail.css';

function InquiryDetail() {

    const { inqId } = useParams();

    const navigate = useNavigate();

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));

    const [inqDetail, setInqDetail] = useState(null);

    const [ansTxt, setAnsTxt] = useState('');

    useEffect(() => {

        fetchInqDetail();

    }, []);

    const fetchInqDetail = async () => {

        try {

            let result = null;

            if (loginUser.roleCd === 'ADMIN') {

                result = await getInqDetail(inqId);

            } else {

                result = await getMyInqDetail(
                    inqId,
                    loginUser.userNum
                );
            }

            console.log('문의 상세 = ', result);

            setInqDetail(result);

            setAnsTxt(result.ansTxt || '');

        } catch (err) {

            console.log(err);

            alert('문의 상세 조회에 실패했습니다.');

            navigate('/cscenter/inquiries');
        }
    };

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            '문의글을 삭제하시겠습니까?'
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteInq(
                inqId,
                loginUser.userNum
            );

            alert('문의글이 삭제되었습니다.');

            navigate('/cscenter/inquiries');

        } catch (err) {

            console.log(err);

            alert('문의글 삭제에 실패했습니다.');
        }
    };

    const handleAnswer = async () => {

        if (!ansTxt.trim()) {

            alert('답변 내용을 입력해주세요.');

            return;
        }

        try {

            await answerInq(inqId, ansTxt);

            alert('답변이 등록되었습니다.');

            fetchInqDetail();

        } catch (err) {

            console.log(err);

            alert('답변 등록에 실패했습니다.');
        }
    };

    if (!inqDetail) {
        return null;
    }

    return (
        <div className="inq-detail-wrap">

            <div className="inq-detail-top">

                <h2 className="inq-detail-title">
                    1:1 문의 상세
                </h2>

            </div>

            <div className="inq-detail-box">

                <div className="inq-detail-row">

                    <div className="inq-detail-label">
                        문의유형
                    </div>

                    <div className="inq-detail-content">
                        {inqDetail.inqTpCd}
                    </div>

                </div>

                <div className="inq-detail-row">

                    <div className="inq-detail-label">
                        제목
                    </div>

                    <div className="inq-detail-content">
                        {inqDetail.ttl}
                    </div>

                </div>

                <div className="inq-detail-row">

                    <div className="inq-detail-label">
                        상태
                    </div>

                    <div className="inq-detail-content">

                        {inqDetail.inqStCd === 'WAITING'
                            ? '답변대기'
                            : '답변완료'}

                    </div>

                </div>

                <div className="inq-detail-text-row">

                    <div className="inq-detail-label">
                        문의내용
                    </div>

                    <div className="inq-detail-text">
                        {inqDetail.inqTxt}
                    </div>

                </div>

            </div>

            {/* 관리자 답변 */}
            <div className="inq-answer-box">
                <div className="inq-answer-title">
                    관리자 답변
                </div>
                {inqDetail.ansTxt ? (
                    <div className="inq-answer-comment">
                        <div className="inq-answer-comment-top">
                            <span className="inq-answer-writer">
                                관리자
                            </span>
                            <span className="inq-answer-date">
                                {inqDetail.ansAt?.substring(0, 10)}
                            </span>
                        </div>
                        <div className="inq-answer-content">
                            {inqDetail.ansTxt}
                        </div>
                    </div>
                ) : loginUser.roleCd === 'ADMIN' ? (
                    <>
                        <textarea
                            className="inq-answer-textarea"
                            value={ansTxt}
                            onChange={(e) => setAnsTxt(e.target.value)}
                            placeholder="답변 내용을 입력해주세요."
                        />
                        <button
                            className="inq-answer-btn"
                            onClick={handleAnswer}
                        >
                            답변 등록
                        </button>
                    </>
                ) : (
                    <div className="inq-answer-content">
                        아직 등록된 답변이 없습니다.
                    </div>
                )}
            </div>

            <div className="inq-detail-btn-wrap">

                <button
                    className="inq-back-btn"
                    onClick={() => navigate('/cscenter/inquiries')}
                >
                    목록
                </button>

                {loginUser.roleCd !== 'ADMIN' &&
                    Number(loginUser.userNum) === Number(inqDetail.userNum) && (
                        <>
                            <button
                                className="inq-edit-btn"
                                onClick={() =>
                                    navigate(`/cscenter/inquiries/${inqId}/edit`)
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

            </div>

        </div>
    );
}

export default InquiryDetail;