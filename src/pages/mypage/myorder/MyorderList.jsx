import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { apiCall } from '../../../service/apiService';

import './MyorderList.css';

function MyorderList() {
    const navigate = useNavigate();

    const userNum = sessionStorage.getItem('userNum');

    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);

    const ORDER_STATUS_TEXT = {
        PAID: '결제완료',
    };

    useEffect(() => {
        const getOrderList = async () => {
            if (!userNum) {
                alert('로그인이 필요한 서비스입니다.');
                navigate('/v1/auth/login');
                return;
            }

            try {
                const data = await apiCall.get(`/order?userNum=${userNum}`);
                setOrderList(data || []);
            } catch (error) {
                console.error('주문 내역 조회 실패:', error);
                alert('주문 내역을 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        getOrderList();
    }, [userNum, navigate]);

    if (loading) {
        return <p>주문 내역을 불러오는 중입니다...</p>;
    }

    return (
        <section className="myOrderList">

            <div className="myOrderHeader">
                <h2>주문 내역</h2>
                <p>주문하신 상품의 내역을 확인할 수 있습니다.</p>
            </div>

            {orderList.length === 0 ? (
                <div className="myOrderEmpty">
                    <p>주문 내역이 없습니다.</p>
                </div>
            ) : (
                <div className="myOrderTableWrap">
                    <table className="myOrderTable">
                        <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>주문일</th>
                                <th>주문상태</th>
                                <th>결제금액</th>
                                <th>상세보기</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orderList.map((order) => (
                                <tr key={order.ordId}>
                                    <td>{order.ordNo}</td>
                                    <td>{order.crtAt?.slice(0, 10)}</td>
                                    <td>
                                        <span className="myOrderStatus">
                                            {ORDER_STATUS_TEXT[order.ordStCd] || order.ordStCd}
                                        </span>
                                    </td>
                                    <td>
                                        {order.totalAmt?.toLocaleString()}원
                                    </td>
                                    <td>
                                        <button
                                            type="button"
                                            className="myOrderDetailBtn"
                                            onClick={() =>
                                                navigate(`/mypage/myorder/${order.ordNo}`)
                                            }
                                        >
                                            상세보기
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

        </section>
    );
}

export default MyorderList;