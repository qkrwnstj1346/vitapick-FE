import { useEffect, useState } from 'react';
import {
    getNoticeList,
    getAdminNoticeList
} from '../../../service/cscenter/csCenterApi';
import './NoticeList.css';
import { Link, useNavigate } from 'react-router-dom';

function NoticeList() {

    const navigate = useNavigate();
    const [noticeList, setNoticeList] = useState([]);

    const isAdmin = true;

    useEffect(() => {

        const api = isAdmin ? getAdminNoticeList : getNoticeList;

        api()
            .then((data) => {
                console.log('공지사항 데이터:', data);
                setNoticeList(data);
            })
            .catch((err) => {
                console.error(err);
                alert('공지사항 조회 실패');
            });

    }, []);

    return (
        <div className="cs-notice-wrap">

            <div className="cs-notice-header">

                <h2 className="cs-notice-title">
                    공지사항
                </h2>

                {isAdmin && (
                    <button
                        className="cs-notice-write-btn"
                        onClick={() => navigate('/cscenter/notices/new')}
                    >
                        등록하기
                    </button>
                )}

            </div>

            {noticeList.length === 0 ? (

                <div className="cs-notice-empty">
                    등록된 공지사항이 없습니다.
                </div>

            ) : (

                <table className="cs-notice-table">

                    <thead>
                        <tr>
                            <th width="10%">번호</th>
                            <th width="50%">제목</th>
                            {isAdmin && <th width="10%">사용여부</th>}
                            <th width="10%">조회수</th>
                            <th width="20%">작성일</th>
                        </tr>
                    </thead>

                    <tbody>

                        {noticeList.map((notice) => (

                            <tr key={notice.ntcId}>

                                <td>{notice.ntcId}</td>

                                <td className="cs-notice-title-cell">
                                    <Link to={`/cscenter/notices/${notice.ntcId}`}>
                                        {notice.ttl}
                                    </Link>
                                </td>

                                {isAdmin && (
                                    <td>{notice.useYn}</td>
                                )}

                                <td>{notice.viewCnt}</td>

                                <td>
                                    {notice.crtAt?.substring(0, 10)}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default NoticeList;