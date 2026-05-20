import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAllInq } from '../../../service/cscenter/csCenterApi';

import './InquiryList.css';

function InquiryList() {

    const navigate = useNavigate();

    const [inqList, setInqList] = useState([]);

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {

        fetchInqList();

    }, []);

    const fetchInqList = async () => {

        try {

            const result = await getAllInq();

            console.log('문의 목록 = ', result);

            setInqList(result);

        } catch (err) {

            console.log(err);

            alert('1:1 문의 목록 조회에 실패했습니다.');
        }
    };

    const handleMoveDetail = (item) => {

        if (!loginUser) {

            alert('로그인 후 이용 가능합니다.');

            navigate('/v1/auth/login');

            return;
        }

        if (loginUser.roleCd === 'ADMIN') {

            navigate(`/cscenter/inquiries/${item.inqId}`);

            return;
        }

        if (Number(loginUser.userNum) === Number(item.userNum)) {

            navigate(`/cscenter/inquiries/${item.inqId}`);

            return;
        }

        alert('본인이 작성한 문의글만 확인할 수 있습니다.');
    };

    const handleMoveWrite = () => {

        if (!loginUser) {

            alert('로그인 후 이용 가능합니다.');

            navigate('/v1/auth/login');

            return;
        }

        if (loginUser.roleCd === 'ADMIN') {

            alert('관리자는 1:1 문의를 등록할 수 없습니다.');

            return;
        }

        navigate('/cscenter/inquiries/new');
    };

    return (
        <div className="inq-wrap">

            <div className="inq-top">

                <h2 className="inq-title">
                    1:1 문의
                </h2>

                <button
                    className="inq-write-btn"
                    onClick={handleMoveWrite}
                >
                    문의 등록
                </button>


            </div>

            <table className="inq-table">

                <thead>
                    <tr>
                        <th>번호</th>
                        <th>문의유형</th>
                        <th>제목</th>
                        <th>상태</th>
                        <th>작성일</th>
                    </tr>
                </thead>

                <tbody>

                    {inqList.length > 0 ? (

                        inqList.map((item) => (

                            <tr
                                key={item.inqId}
                                onClick={() => handleMoveDetail(item)}
                            >

                                <td>{item.inqId}</td>

                                <td>{item.inqTpCd}</td>

                                <td className="inq-ttl">
                                    {item.ttl}
                                </td>

                                <td>
                                    {item.inqStCd === 'WAITING'
                                        ? '답변대기'
                                        : '답변완료'}
                                </td>

                                <td>
                                    {item.crtAt?.substring(0, 10)}
                                </td>

                            </tr>

                        ))

                    ) : (

                        <tr>
                            <td colSpan="5" className="inq-empty">
                                등록된 문의가 없습니다.
                            </td>
                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
}

export default InquiryList;