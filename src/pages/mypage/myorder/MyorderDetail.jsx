import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    getOrderDetail,
    getOrderItems,
    getOrderPay
} from '../../../service/order/orderApi';

import './MyorderDetail.css';

function MyorderDetail() {
    const navigate = useNavigate();
    const { ordNo } = useParams();

    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrderDetail = async () => {
            try {
                const orderData = await getOrderDetail(ordNo);
                setOrder(orderData);

                const itemsData = await getOrderItems(orderData.ordId);
                setOrderItems(itemsData || []);

                const payData = await getOrderPay(orderData.ordId);
                setPayment(payData);
            } catch (error) {
                console.error('주문 상세 조회 실패:', error);
                console.error('응답 내용:', error.response?.data);
                alert(error.response?.data || '주문 상세 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadOrderDetail();
    }, [ordNo]);

    if (loading) {
        return <p>주문 상세 정보를 불러오는 중입니다...</p>;
    }

    if (!order) {
        return <p>주문 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <section className="myOrderDetail">

            <div className="myOrderDetailHeader">
                <h2>주문 상세</h2>
                <p>주문번호 {order.ordNo}</p>
            </div>

            <div className="myOrderInfoBox">
                <div>
                    <strong>주문일</strong>
                    <span>{order.crtAt?.slice(0, 10)}</span>
                </div>

                <div>
                    <strong>주문상태</strong>
                    <span>{order.ordStCd}</span>
                </div>

                <div>
                    <strong>결제금액</strong>
                    <span>{order.totalAmt?.toLocaleString()}원</span>
                </div>

                <div>
                    <strong>결제수단</strong>
                    <span>{payment?.payMthdCd || '-'}</span>
                </div>
            </div>

            <div className="myOrderItemBox">
                <h3>주문 상품</h3>

                {orderItems.length === 0 ? (
                    <p className="myOrderItemEmpty">
                        주문 상품 정보가 없습니다.
                    </p>
                ) : (
                    orderItems.map((item) => (
                        <div className="myOrderItem" key={item.ordItId}>

                            <img
                                src={item.thumbImgUrl}
                                alt={item.prdNm}
                                className="myOrderItemImg"
                            />

                            <div className="myOrderItemInfo">
                                <strong>{item.prdNm}</strong>
                                <p>
                                    수량 {item.itQty}개 · {Number(item.price || 0).toLocaleString()}원
                                </p>
                            </div>

                            <span className="myOrderItemPrice">
                                {Number(item.itAmt || 0).toLocaleString()}원
                            </span>

                        </div>
                    ))
                )}
            </div>

            <div className="myOrderDetailButtons">
                <button
                    type="button"
                    onClick={() => navigate('/mypage/myorder')}
                >
                    목록으로
                </button>
            </div>

        </section>
    );
}

export default MyorderDetail;