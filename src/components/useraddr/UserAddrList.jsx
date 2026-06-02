import { useEffect, useState } from 'react';
import {
    getAddrList,
    deleteAddr,
    updateBaseAddr
} from '../../../service/address/addressApi';

import './AddressList.css';

function AddressList() {

    const [addrList, setAddrList] = useState([]);

    /* 배송지 목록 조회 */
    const fetchAddrList = () => {
        getAddrList()
            .then(res => {
                setAddrList(res.data);
            })
            .catch(err => {
                console.log(err);
                alert('배송지 목록 조회에 실패했습니다.');
            });
    };

    /* 배송지 삭제 */
    const handleDelete = (addrId) => {

        if (!window.confirm('배송지를 삭제하시겠습니까?')) {
            return;
        }

        deleteAddr(addrId)
            .then(() => {
                alert('배송지가 삭제되었습니다.');
                fetchAddrList();
            })
            .catch(err => {
                console.log(err);
                alert('배송지 삭제에 실패했습니다.');
            });
    };

    /* 기본 배송지 설정 */
    const handleBaseAddr = (addrId) => {

        updateBaseAddr(addrId)
            .then(() => {
                alert('기본 배송지로 설정되었습니다.');
                fetchAddrList();
            })
            .catch(err => {
                console.log(err);
                alert('기본 배송지 설정에 실패했습니다.');
            });
    };

    useEffect(() => {
        fetchAddrList();
    }, []);

    return (
        <div className="addrPage">

            {/* 상단 */}
            <div className="addrHeader">
                <div>
                    <h2 className="addrTitle">배송지 관리</h2>
                    <p className="addrDesc">
                        주문 시 사용할 배송지를 관리할 수 있습니다.
                    </p>
                </div>

                <button className="addrAddBtn">
                    배송지 추가
                </button>
            </div>

            {/* 목록 */}
            <div className="addrList">
                {
                    addrList.length === 0 ? (
                        <div className="addrEmpty">
                            등록된 배송지가 없습니다.
                        </div>
                    ) : (
                        addrList.map(addr => (
                            <div className="addrCard" key={addr.addrId}>

                                <div className="addrCardTop">
                                    <div>
                                        <span className="addrName">
                                            {addr.addrNm}
                                        </span>

                                        {
                                            addr.baseYn === 'Y' && (
                                                <span className="baseBadge">
                                                    기본 배송지
                                                </span>
                                            )
                                        }
                                    </div>
                                </div>

                                <div className="addrInfo">
                                    <p>{addr.rcvNm}</p>
                                    <p>{addr.rcvTel}</p>
                                    <p>
                                        ({addr.zipCd}) {addr.addr1} {addr.addr2}
                                    </p>
                                </div>

                                <div className="addrBtnBox">
                                    {
                                        addr.baseYn !== 'Y' && (
                                            <button
                                                className="addrSubBtn"
                                                onClick={() => handleBaseAddr(addr.addrId)}
                                            >
                                                기본 배송지 설정
                                            </button>
                                        )
                                    }

                                    <button className="addrSubBtn">
                                        수정
                                    </button>

                                    <button
                                        className="addrDeleteBtn"
                                        onClick={() => handleDelete(addr.addrId)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        ))
                    )
                }
            </div>
        </div>
    );
}

export default AddressList;