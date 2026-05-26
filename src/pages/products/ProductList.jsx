import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall, getToken } from '../../service/apiService';
import './ProductList.css';

const ProductList = () => {

    //
    const { catCd, keyword } = useParams();

    // 상품 목록
    const [prdList, setPrdList] = useState([]);

    // 로딩 상태
    const [loading, setLoading] = useState(true);

    // 카테고리 또는 검색어 바뀔 때마다 상품 목록 가져오기
    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            const token = getToken();
            try {
                // 검색어 있으면 검색 API, 없으면 카테고리 API 호출
                const url = keyword
                    ? `/api/v1/product/search?keyword=${keyword}`
                    : `/api/v1/product/list/category/${catCd}`;
                const data = await apiCall(url, 'GET', null, token, false);
                setPrdList(data);
            } catch (err) {
                console.error('상품 목록 오류:', err);
            } finally {
                setLoading(false);
            }
        };
        // 상품 목록 가져오기
        fetchList();
    }, [catCd, keyword]);

    if (loading) return <div className='prd_loading'>로딩 중...</div>;

    return (
        <div className='prd_container'>

            <div className='prd_list'>
                {prdList.map((prd) => (
                    <div key={prd.prdId} className='prd_card' onClick={() => window.location.href = `/products/detail/${prd.prdId}`}>
                        <img src={prd.thumbImgUrl} alt={prd.prdNm} />
                        <div className='prd_info'>
                            <p className='prd_brand'>{prd.brand}</p>
                            <h3 className='prd_nm'>{prd.prdNm}</h3>
                            <strong className='prd_price'>{prd.price.toLocaleString()}원</strong>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );

};

export default ProductList;