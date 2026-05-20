import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    getFaqDetail,
    deleteFaq
} from '../../../service/cscenter/csCenterApi';

import './FaqDetail.css';

function FaqDetail() {

    const { faqId } = useParams();
    const navigate = useNavigate();

    const [detail, setDetail] = useState(null);

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));
    const isAdmin = loginUser?.roleCd === 'ADMIN';

    useEffect(() => {

        getFaqDetail(faqId)
            .then((data) => {
                console.log('FAQ 상세 데이터:', data);
                setDetail(data);
            })
            .catch((err) => {
                console.log(err);
                alert('FAQ 상세 정보를 불러오지 못했습니다.');
                navigate('/cscenter/faqs');
            });

    }, [faqId, navigate]);

    const moveList = () => {
        navigate('/cscenter/faqs');
    };

    const moveEdit = () => {
        navigate(`/cscenter/faqs/${faqId}/edit`);
    };

    const removeFaq = () => {

        if (!isAdmin) {
            alert('관리자만 삭제할 수 있습니다.');
            return;
        }

        if (!window.confirm('FAQ를 삭제하시겠습니까?')) {
            return;
        }

        deleteFaq(faqId)
            .then(() => {
                alert('FAQ가 삭제되었습니다.');
                navigate('/cscenter/faqs');
            })
            .catch((err) => {
                console.log(err);
                alert('FAQ 삭제에 실패했습니다.');
            });

    };

    if (detail === null) {
        return <div>로딩중...</div>;
    }

    return (
        <div className="cs-faq-detail-container">

            <h1 className="cs-faq-detail-title">
                {detail.ttl}
            </h1>

            <div className="cs-faq-detail-info">
                <span>카테고리 : {detail.faqCtgCd}</span>
                <span>조회수 : {detail.viewCnt}</span>
                <span>작성일 : {detail.crtAt?.substring(0, 10)}</span>

                {isAdmin && (
                    <span>사용여부 : {detail.useYn}</span>
                )}
            </div>

            <div className="cs-faq-detail-content">
                {detail.faqTxt}
            </div>

            <div className="cs-faq-detail-btn-wrap">

                {isAdmin && (
                    <>
                        <button
                            type="button"
                            className="cs-faq-edit-btn"
                            onClick={moveEdit}
                        >
                            수정
                        </button>

                        <button
                            type="button"
                            className="cs-faq-delete-btn"
                            onClick={removeFaq}
                        >
                            삭제
                        </button>
                    </>
                )}

                <button
                    type="button"
                    className="cs-faq-detail-btn"
                    onClick={moveList}
                >
                    목록
                </button>

            </div>

        </div>
    );
}

export default FaqDetail;