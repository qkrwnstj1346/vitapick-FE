import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNoticeList } from '../../../service/cscenter/csCenterApi';
import './CsMain.css';
// 프론트 깃 커밋 테스트 

function CsMain() {

    const [noticeList, setNoticeList] = useState([]);

    useEffect(() => {

        getNoticeList()
            .then((data) => {
                console.log('CS 메인 공지사항 = ', data);
                setNoticeList(data.slice(0, 5));
            })
            .catch((error) => {
                console.error(error);
                alert('공지사항을 불러오지 못했습니다.');
            });

    }, []);

    return (
        <div className="cs-wrap">
            <div className="cs-left">
                <h2 className="cs-title">CS CENTER</h2>

                <ul className="cs-menu">
                    <li>FAQ</li>
                    <li>
                        <Link to="/cscenter/notices">
                            공지사항
                        </Link>
                    </li>
                    <li>1:1 문의</li>
                </ul>

                <div className="cs-info">
                    <h3>
                        02-1111-1111
                    </h3>

                    <p>평일 10:00 ~ 19:00 (주말,공휴일 제외)</p>
                </div>
            </div>

            <div className="cs-right">

                <div className="cs-notice-top">
                    <h3>공지사항</h3>

                    <Link to="/cscenter/notices">
                        전체보기 &gt;
                    </Link>
                </div>

                <ul className="cs-notice-list">
                    {noticeList.length === 0 ? (
                        <li className="cs-notice-empty">
                            등록된 공지사항이 없습니다.
                        </li>
                    ) : (
                        noticeList.map((notice) => (
                            <li key={notice.ntcId}>
                                <div className="cs-notice-left">

                                    <Link to={`/cscenter/notices/${notice.ntcId}`}>
                                        {notice.ttl}
                                    </Link>
                                </div>

                                <div className="cs-notice-right">
                                    <span>{notice.crtAt?.substring(0, 10)}</span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}

export default CsMain;