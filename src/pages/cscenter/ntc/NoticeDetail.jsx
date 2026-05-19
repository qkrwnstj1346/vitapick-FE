import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getNoticeDetail,
    deleteNotice
} from '../../../service/cscenter/csCenterApi';
import './NoticeDetail.css';

function NoticeDetail() {

    const { ntcId } = useParams();
    const navigate = useNavigate();

    const [detail, setDetail] = useState(null);

    const isAdmin = true;

    useEffect(() => {

        getNoticeDetail(ntcId)
            .then((data) => {
                console.log(data);
                setDetail(data);
            })
            .catch((err) => {
                console.log(err);
                alert('공지사항 상세 정보를 불러오지 못했습니다.');
                navigate('/cscenter/notices');
            });

    }, [ntcId, navigate]);

    const moveList = () => {
        navigate('/cscenter/notices');
    };

    const moveEdit = () => {
        navigate(`/cscenter/notices/${ntcId}/edit`);
    };

    const removeNotice = () => {

        if (!isAdmin) {
            alert('관리자만 삭제할 수 있습니다.');
            return;
        }

        if (!window.confirm('공지사항을 삭제하시겠습니까?')) {
            return;
        }

        deleteNotice(ntcId)
            .then(() => {
                alert('공지사항이 삭제되었습니다.');
                navigate('/cscenter/notices');
            })
            .catch((err) => {
                console.log(err);
                alert('공지사항 삭제에 실패했습니다.');
            });

    };

    if (detail == null) {
        return <div>로딩중...</div>;
    }

    return (
        <div className="cs-notice-detail-container">

            <h1 className="cs-notice-detail-title">
                {detail.ttl}
            </h1>

            <div className="cs-notice-detail-info">
                <span>조회수 : {detail.viewCnt}</span>
                <span>작성일 : {detail.crtAt?.substring(0, 10)}</span>
                {isAdmin && (
                    <span>사용여부 : {detail.useYn}</span>
                )}
            </div>

            <div className="cs-notice-detail-content">
                {detail.ntcTxt}
            </div>

            <div className="cs-notice-detail-btn-wrap">

                {isAdmin && (
                    <>
                        <button
                            type="button"
                            className="cs-notice-edit-btn"
                            onClick={moveEdit}
                        >
                            수정
                        </button>

                        <button
                            type="button"
                            className="cs-notice-delete-btn"
                            onClick={removeNotice}
                        >
                            삭제
                        </button>
                    </>
                )}

                <button
                    type="button"
                    className="cs-notice-detail-btn"
                    onClick={moveList}
                >
                    목록
                </button>

            </div>

        </div>
    );
}

export default NoticeDetail;