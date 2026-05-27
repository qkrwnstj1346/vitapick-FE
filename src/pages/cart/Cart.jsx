import { useEffect, useMemo, useState } from 'react';

import {
    getCartList,
    updateCartQty,
    updateCartSelectedYn,
    deleteCart,
    deleteAllCart
} from '../../service/cart/cartApi';

import './Cart.css';

function Cart() {

    const loginUser = JSON.parse(localStorage.getItem('userInfo'));

    const userNum = loginUser?.userNum;

    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        fetchCartList();
    }, []);

    const fetchCartList = async () => {
        try {
            const res = await getCartList(userNum);
            console.log('장바구니 응답', res);
            setCartList(Array.isArray(res) ? res : []);
        } catch (err) {
            console.log(err);
            alert('장바구니 목록 조회에 실패했습니다.');
        }
    };

    const plusQty = async (cartId, currentQty) => {
        try {
            await updateCartQty(cartId, {
                itQty: currentQty + 1
            });
            fetchCartList();
        } catch (err) {
            alert(err.response?.data || '수량 변경 실패');
        }
    };

    const minusQty = async (cartId, currentQty) => {
        if (currentQty <= 1) {
            return;
        }

        try {
            await updateCartQty(cartId, {
                itQty: currentQty - 1
            });
            fetchCartList();
        } catch (err) {
            alert(err.response?.data || '수량 변경 실패');
        }
    };

    const handleDelete = async (cartId) => {
        const confirmDelete = window.confirm('상품을 삭제하시겠습니까?');

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteCart(cartId);
            alert('상품이 삭제되었습니다.');
            fetchCartList();
        } catch (err) {
            alert(err.response?.data || '삭제 실패');
        }
    };

    const handleDeleteAll = async () => {
        const confirmDelete = window.confirm('장바구니를 전체 삭제하시겠습니까?');

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteAllCart(userNum);
            alert('전체 삭제되었습니다.');
            fetchCartList();
        } catch (err) {
            alert(err.response?.data || '전체 삭제 실패');
        }
    };

    const toggleSelectedYn = async (item) => {

        try {

            await updateCartSelectedYn(item.cartId, {
                selectedYn: item.selectedYn === 'Y' ? 'N' : 'Y'
            });

            fetchCartList();

        } catch (err) {

            alert(err.response?.data || '상품 선택 상태 변경에 실패했습니다.');
        }
    };


    const customCartGroups = useMemo(() => {
        const groupObj = {};

        (cartList || [])
            .filter(item => item.cusId !== null)
            .forEach(item => {
                if (!groupObj[item.cusId]) {
                    groupObj[item.cusId] = [];
                }

                groupObj[item.cusId].push(item);
            });

        return Object.entries(groupObj).map(([cusId, items]) => ({
            cusId,
            items
        }));
    }, [cartList]);

    const normalCartList = useMemo(() => {
        return (cartList || []).filter(item => item.cusId === null);
    }, [cartList]);

    return (
        <div className="cartPage">

            <div className="cartTop">
                <h2 className="cartTitle">
                    장바구니
                </h2>

                <button
                    className="deleteAllBtn"
                    onClick={handleDeleteAll}
                >
                    전체 삭제
                </button>
            </div>

            <section className="cartSection">
                <h3 className="sectionTitle">
                    커스텀 비타민
                </h3>

                {
                    customCartGroups.length === 0 ? (
                        <p className="emptyText">
                            커스텀 비타민 상품이 없습니다.
                        </p>
                    ) : (
                        customCartGroups.map((group, index) => (
                            <div
                                className="customGroup"
                                key={group.cusId}
                            >
                                <div className="customGroupTitleBox">
                                    <h4 className="customGroupTitle">
                                        커스텀 비타민 묶음 {index + 1}
                                    </h4>

                                    <p className="customGroupSub">
                                        커스텀 ID : {group.cusId}
                                    </p>
                                </div>

                                {
                                    group.items.map(item => (
                                        <div className="cartItem" key={item.cartId}>

                                            <div className="cartCheckBox">
                                                <input
                                                    type="checkbox"
                                                    checked={item.selectedYn === 'Y'}
                                                    onChange={() => toggleSelectedYn(item)}

                                                />
                                            </div>

                                            <div className="cartImgBox">
                                                <img
                                                    src={item.thumbImgUrl}
                                                    alt={item.prdNm}
                                                    className="cartImg"
                                                />
                                            </div>

                                            <div className="cartInfo">
                                                <p className="cartBrand">
                                                    {item.brand}
                                                </p>

                                                <p className="cartPrdNm">
                                                    {item.prdNm}
                                                </p>

                                                <p className="cartPrice">
                                                    {item.price?.toLocaleString()}원
                                                </p>
                                            </div>

                                            <div className="cartBtnBox">
                                                <button
                                                    type="button"
                                                    onClick={() => minusQty(item.cartId, item.itQty)}
                                                >
                                                    -
                                                </button>

                                                <p className="qtyText">
                                                    {item.itQty}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => plusQty(item.cartId, item.itQty)}
                                                >
                                                    +
                                                </button>

                                                <button
                                                    type="button"
                                                    className="deleteBtn"
                                                    onClick={() => handleDelete(item.cartId)}
                                                >
                                                    삭제
                                                </button>
                                            </div>

                                        </div>
                                    ))
                                }
                            </div>
                        ))
                    )
                }
            </section>

            <section className="cartSection">
                <h3 className="sectionTitle">
                    일반 상품
                </h3>

                {
                    normalCartList.length === 0 ? (
                        <p className="emptyText">
                            일반 상품이 없습니다.
                        </p>
                    ) : (
                        normalCartList.map(item => (
                            <div className="cartItem" key={item.cartId}>

                                <div className="cartCheckBox">
                                    <input
                                        type="checkbox"
                                        checked={item.selectedYn === 'Y'}
                                        onChange={() => toggleSelectedYn(item)}

                                    />
                                </div>

                                <div className="cartImgBox">
                                    <img
                                        src={item.thumbImgUrl}
                                        alt={item.prdNm}
                                        className="cartImg"
                                    />
                                </div>

                                <div className="cartInfo">
                                    <p className="cartBrand">
                                        {item.brand}
                                    </p>

                                    <p className="cartPrdNm">
                                        {item.prdNm}
                                    </p>

                                    <p className="cartPrice">
                                        {item.price?.toLocaleString()}원
                                    </p>
                                </div>

                                <div className="cartBtnBox">
                                    <button
                                        type="button"
                                        onClick={() => minusQty(item.cartId, item.itQty)}
                                    >
                                        -
                                    </button>

                                    <p className="qtyText">
                                        {item.itQty}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => plusQty(item.cartId, item.itQty)}
                                    >
                                        +
                                    </button>

                                    <button
                                        type="button"
                                        className="deleteBtn"
                                        onClick={() => handleDelete(item.cartId)}
                                    >
                                        삭제
                                    </button>
                                </div>

                            </div>
                        ))
                    )
                }
            </section>

            <div className="cartBottom">
                <button
                    type="button"
                    className="orderBtn"
                >
                    주문하기
                </button>
            </div>

        </div>
    );
}

export default Cart;