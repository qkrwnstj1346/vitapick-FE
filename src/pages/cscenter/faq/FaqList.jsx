import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    getFaqList,
    getUseYnFaqList
} from '../../../service/cscenter/csCenterApi';

import Pagination from '../../../components/layout/Pagination';

import './FaqList.css';

function FaqList() {

    const navigate = useNavigate();

    const [faqList, setFaqList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const itemPerPage = 10;

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));

    const isAdmin = loginUser?.roleCd === 'ADMIN';

    const totalPage = Math.ceil(faqList.length / itemPerPage);

    const startIndex = (currentPage - 1) * itemPerPage;

    const currentFaqList = faqList.slice(
        startIndex,
        startIndex + itemPerPage
    );

    useEffect(() => {

        const api = isAdmin
            ? getFaqList
            : getUseYnFaqList;

        api()
            .then((data) => {

                console.log('FAQ 목록 데이터:', data);

                setFaqList(data);
                setCurrentPage(1);

            })
            .catch((err) => {

                console.log(err);

                alert('FAQ 목록 조회에 실패했습니다.');

            });

    }, [isAdmin]);

    return (

        <div className="cs-faq-wrap">

            <div className="cs-faq-header">

                <h2 className="cs-faq-title">
                    FAQ
                </h2>

                {isAdmin && (

                    <button
                        type="button"
                        className="cs-faq-write-btn"
                        onClick={() => navigate('/cscenter/faqs/new')}
                    >
                        등록하기
                    </button>

                )}

            </div>

            {faqList.length === 0 ? (

                <div className="cs-faq-empty">
                    등록된 FAQ가 없습니다.
                </div>

            ) : (

                <>

                    <table className="cs-faq-table">

                        <thead>

                            <tr>

                                <th width="10%">
                                    번호
                                </th>

                                <th width="15%">
                                    카테고리
                                </th>

                                <th width="45%">
                                    제목
                                </th>

                                {isAdmin && (

                                    <th width="10%">
                                        사용여부
                                    </th>

                                )}

                                <th width="10%">
                                    조회수
                                </th>

                                <th width="10%">
                                    작성일
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {currentFaqList.map((faq) => (

                                <tr key={faq.faqId}>

                                    <td>
                                        {faq.faqId}
                                    </td>

                                    <td>
                                        {faq.faqCtgCd}
                                    </td>

                                    <td className="cs-faq-title-cell">

                                        <Link to={`/cscenter/faqs/${faq.faqId}`}>
                                            {faq.ttl}
                                        </Link>

                                    </td>

                                    {isAdmin && (

                                        <td>
                                            {faq.useYn}
                                        </td>

                                    )}

                                    <td>
                                        {faq.viewCnt}
                                    </td>

                                    <td>
                                        {faq.crtAt?.substring(0, 10)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    <Pagination
                        currentPage={currentPage}
                        totalPage={totalPage}
                        onPageChange={setCurrentPage}
                    />

                </>

            )}

        </div>

    );
}

export default FaqList;