import { useEffect, useState } from 'react';
import { getNoticeList } from '../../../service/cscenter/csCenterApi';
import { Link, useNavigate } from 'react-router-dom';

import Pagination from '../../../components/layout/Pagination';

import './NoticeList.css';

function NoticeList() {

    /* 페이지 이동 */
    const navigate = useNavigate();

    /* 공지사항 목록 */
    const [noticeList, setNoticeList] = useState([]);

    /* 현재 페이지 */
    const [currentPage, setCurrentPage] = useState(1);

    /* 페이지당 개수 */
    const itemPerPage = 10;

    /* 로그인 정보 */
    const userNum = sessionStorage.getItem('userNum');
    const roleCd = sessionStorage.getItem('roleCd');

    /* 로그인 여부 */
    const isLogin = !!userNum;

    /* 관리자 여부 */
    const isAdmin = roleCd === 'ADMIN';

    /* 전체 페이지 */
    const totalPage = Math.ceil(noticeList.length / itemPerPage);

    /* 시작 인덱스 */
    const startIndex = (currentPage - 1) * itemPerPage;

    /* 현재 페이지 공지사항 목록 */
    const currentNoticeList = noticeList.slice(
        startIndex,
        startIndex + itemPerPage
    );

    /* 공지사항 목록 조회 */
    useEffect(() => {

        getNoticeList()
            .then((data) => {
                console.log('공지사항 데이터:', data);
                setNoticeList(Array.isArray(data) ? data : []);
                setCurrentPage(1);
            })
            .catch((err) => {
                console.error(err);
                alert('공지사항 조회 실패');
            });

    }, []);

    return (

        <div className="cs-notice-wrap">

            {/* 상단 영역 */}
            <div className="cs-notice-header">

                <h2 className="cs-notice-title">
                    공지사항
                </h2>

                {/* 관리자 등록 버튼 */}
                {isLogin && isAdmin && (

                    <button
                        className="cs-notice-write-btn"
                        onClick={() => navigate('/cscenter/notices/new')}
                    >
                        등록하기
                    </button>

                )}

            </div>

            {/* 공지사항 테이블 */}
            <table className="cs-notice-table">

                <thead>

                    <tr>

                        <th width="10%">번호</th>

                        <th width="50%">제목</th>

                        {/* 관리자 전용 */}
                        {isAdmin && <th width="10%">사용여부</th>}

                        <th width="10%">조회수</th>

                        <th width="20%">작성일</th>

                    </tr>

                </thead>

                <tbody>

                    {noticeList.length > 0 ? (

                        currentNoticeList.map((notice) => (

                            <tr key={notice.ntcId}>

                                <td>{notice.ntcId}</td>

                                <td className="cs-notice-title-cell">

                                    <Link to={`/cscenter/notices/${notice.ntcId}`}>
                                        {notice.ttl}
                                    </Link>

                                </td>

                                {/* 관리자 전용 */}
                                {isAdmin && (
                                    <td>{notice.useYn}</td>
                                )}

                                <td>{notice.viewCnt}</td>

                                <td>
                                    {notice.crtAt?.substring(0, 10)}
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td
                                className="cs-notice-empty"
                                colSpan={isAdmin ? 5 : 4}
                            >
                                등록된 공지사항이 없습니다.
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>

            {/* 페이지네이션 */}
            {totalPage > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPage={totalPage}
                    onPageChange={setCurrentPage}
                />
            )}

        </div>
    );
}

export default NoticeList;