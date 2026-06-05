import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getSelectedCartList } from '../../service/cart/cartApi';
import {
    getOrderAddressList,
    createOrder
} from '../../service/order/orderApi';

import './Order.css';

function Order() {

    const navigate = useNavigate();
    const location = useLocation();

    /* 바로구매 상품 */
    const directOrderList = location.state?.prdList || [];

    /* 장바구니 선택 상품 */
    const cartOrderList = location.state?.cartOrderList || [];

    /* 주문 타입 */
    const isDirectOrder = directOrderList.length > 0;
    const isCartStateOrder = cartOrderList.length > 0;

    /* 주문상품 */
    const [orderItemList, setOrderItemList] = useState([]);

    /* 배송지 */
    const [addrList, setAddrList] = useState([]);
    const [selectedAddrId, setSelectedAddrId] = useState('');

    /* 결제수단 */
    const [payMthdCd, setPayMthdCd] = useState('CARD');

    /* 금액 */
    const totalAmt = orderItemList.reduce((sum, item) => {
        const price = item.price || 0;
        const qty = item.itQty || item.it_qty || 1;

        return sum + price * qty;
    }, 0);

    /* 초기 데이터 */
    useEffect(() => {
        fetchAddressList();

        if (isDirectOrder) {
            setOrderItemList(directOrderList);
            return;
        }

        if (isCartStateOrder) {
            setOrderItemList(cartOrderList);
            return;
        }

        fetchSelectedCartList();
    }, []);

    /* 배송지 목록 조회 */
    const fetchAddressList = () => {
        getOrderAddressList()
            .then(res => {
                const list = res.data || [];

                setAddrList(list);

                const baseAddr = list.find(addr => addr.baseYn === 'Y');

                if (baseAddr) {
                    setSelectedAddrId(baseAddr.addrId);
                } else if (list.length > 0) {
                    setSelectedAddrId(list[0].addrId);
                }
            })
            .catch(err => {
                console.log(err);
                alert('배송지 목록 조회에 실패했습니다.');
            });
    };

    /* 선택 장바구니 조회 */
    const fetchSelectedCartList = () => {
        getSelectedCartList()
            .then(res => {
                const list = res.data || [];

                if (list.length === 0) {
                    alert('선택된 상품이 없습니다.');
                    navigate('/cart');
                    return;
                }

                setOrderItemList(list);
            })
            .catch(err => {
                console.log(err);
                alert('주문 상품 조회에 실패했습니다.');
            });
    };

    /* 주문하기 */
    const handleOrder = () => {

        if (!selectedAddrId) {
            alert('배송지를 선택해주세요.');
            return;
        }

        if (orderItemList.length === 0) {
            alert('주문할 상품이 없습니다.');
            return;
        }

        const prdList = orderItemList.map(item => {
            const qty = item.itQty || item.it_qty || 1;
            const price = item.price || 0;

            return {
                prdId: item.prdId,
                cusId: item.cusId || null,
                prdNm: item.prdNm,
                itQty: qty,
                price,
                itAmt: price * qty
            };
        });

        const orderData = {
            addrId: selectedAddrId,
            totalAmt,
            payDto: {
                payMthdCd
            },
            ...(isDirectOrder && { prdList })
        };

        createOrder(orderData)
            .then(res => {
                alert('주문이 완료되었습니다.');
                navigate(`/order/complete/${res.data.ordNo}`);
            })
            .catch(err => {
                console.log(err);
                alert(err.response?.data || '주문 생성에 실패했습니다.');
            });
    };

    return (
        <div className="orderPage">

            <h2 className="orderTitle">주문서</h2>

            <div className="orderContent">

                <div className="orderLeft">

                    <section className="orderSection">
                        <div className="orderSectionTop">
                            <h3>배송지</h3>

                            <button
                                type="button"
                                className="addrAddBtn"
                                onClick={() => navigate('/address')}
                            >
                                배송지 추가
                            </button>
                        </div>

                        {addrList.length === 0 ? (
                            <div className="emptyAddrBox">
                                <p>등록된 배송지가 없습니다.</p>

                                <button
                                    type="button"
                                    onClick={() => navigate('/address')}
                                >
                                    배송지 추가하기
                                </button>
                            </div>
                        ) : (
                            <div className="addrList">
                                {addrList.map(addr => (
                                    <label
                                        key={addr.addrId}
                                        className={`addrCard ${selectedAddrId === addr.addrId ? 'active' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="addr"
                                            checked={selectedAddrId === addr.addrId}
                                            onChange={() => setSelectedAddrId(addr.addrId)}
                                        />

                                        <div>
                                            <div className="addrNameRow">
                                                <strong>{addr.addrNm}</strong>

                                                {addr.baseYn === 'Y' && (
                                                    <span>기본 배송지</span>
                                                )}
                                            </div>

                                            <p>{addr.rcvNm} / {addr.rcvTel}</p>
                                            <p>[{addr.zipCd}] {addr.addr1} {addr.addr2}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="orderSection">
                        <h3>주문 상품</h3>

                        <div className="orderItemList">
                            {orderItemList.map((item, index) => {
                                const qty = item.itQty || item.it_qty || 1;
                                const price = item.price || 0;
                                const itemAmt = price * qty;

                                return (
                                    <div
                                        className="orderItem"
                                        key={item.cartId || item.prdId || index}
                                    >
                                        <div className="orderItemInfo">
                                            <strong>{item.prdNm}</strong>
                                            <p>{item.brand}</p>
                                            <span>수량 {qty}개</span>
                                        </div>

                                        <div className="orderItemPrice">
                                            {itemAmt.toLocaleString()}원
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="orderSection">
                        <h3>결제수단</h3>

                        <div className="payMethodBox">
                            <label className={payMthdCd === 'CARD' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="pay"
                                    checked={payMthdCd === 'CARD'}
                                    onChange={() => setPayMthdCd('CARD')}
                                />
                                카드결제
                            </label>

                            <label className={payMthdCd === 'BANK' ? 'active' : ''}>
                                <input
                                    type="radio"
                                    name="pay"
                                    checked={payMthdCd === 'BANK'}
                                    onChange={() => setPayMthdCd('BANK')}
                                />
                                무통장입금
                            </label>
                        </div>
                    </section>
                </div>

                <aside className="orderSummary">
                    <h3>결제금액</h3>

                    <div className="summaryRow">
                        <span>상품금액</span>
                        <strong>{totalAmt.toLocaleString()}원</strong>
                    </div>

                    <div className="summaryRow">
                        <span>배송비</span>
                        <strong>0원</strong>
                    </div>

                    <div className="summaryTotal">
                        <span>총 결제금액</span>
                        <strong>{totalAmt.toLocaleString()}원</strong>
                    </div>

                    <button
                        type="button"
                        className="orderBtn"
                        onClick={handleOrder}
                        disabled={addrList.length === 0}
                    >
                        주문하기
                    </button>
                </aside>

            </div>
        </div>
    );
}

export default Order;