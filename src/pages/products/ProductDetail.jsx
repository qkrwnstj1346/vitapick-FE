import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall, getToken } from '../../service/apiService';
import './ProductDetail.css';

const ProductDetail = () => {

    const { prdId } = useParams();
    const [prd, setPrd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('desc');
    const [wished, setWished] = useState(false);

    useEffect(() => {
        const token = getToken();
        apiCall(`/api/v1/product/detail/${prdId}`, 'GET', null, token, false)
            .then(data => {
                setPrd(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [prdId]);

    if (loading) return <div className='detail_loading'>로딩 중...</div>;
    if (!prd) return <div className='detail_loading'>상품을 찾을 수 없습니다.</div>;

    return (
        <div className='detail_container'>

            {/* 상단 상품 정보 */}
            <div className='detail_top'>

                {/* 상품 이미지 */}
                <div className='detail_img_box'>
                    <img src={prd.thumbImgUrl} alt={prd.prdNm} />
                </div>

                {/* 상품 정보 */}
                <div className='detail_info'>
                    <p className='detail_brand'>{prd.brand}</p>
                    <h2 className='detail_nm'>{prd.prdNm}</h2>
                    <strong className='detail_price'>{prd.price.toLocaleString()}원</strong>

                    <div className='detail_btns'>

                        {/* 찜하기 버튼 */}
                        <button
                            className={`detail_wish_btn ${wished ? 'wished' : ''}`}
                            onClick={() => setWished(prev => !prev)}
                        >
                            {wished ? '♥ 찜완료' : '♡ 찜하기'}
                        </button>

                        {/* 장바구니 버튼 */}
                        <button className='detail_cart_btn'>
                            장바구니 담기
                        </button>

                    </div>
                </div>

            </div>

            {/* 탭 */}
            <div className='detail_tabs'>
                <button
                    className={activeTab === 'desc' ? 'tab_active' : ''}
                    onClick={() => setActiveTab('desc')}
                >
                    상품설명
                </button>
                <button
                    className={activeTab === 'rvw' ? 'tab_active' : ''}
                    onClick={() => setActiveTab('rvw')}
                >
                    상품평
                </button>
            </div>

            {/* 탭 내용 */}
            <div className='detail_tab_content'>

                {/* 상품설명 */}
                {activeTab === 'desc' && (
                    <div className='detail_desc'>
                        <img src={`/images/prd_desc_${prdId}.jpg`} alt='상품설명' />
                    </div>
                )}

                {/* 상품평 */}
                {activeTab === 'rvw' && (
                    <div className='detail_rvw'>
                        <p>상품평 준비 중입니다.</p>
                    </div>
                )}

            </div>

        </div>
    );

};

export default ProductDetail;