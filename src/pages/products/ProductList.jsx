import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiCall, getToken } from '../../service/apiService';
import './ProductList.css';

const ProductList = () => {

    // URL에서 카테고리 번호 가져오기
    const { catCd } = useParams();

    // 상품 목록
    const [prdList, setPrdList] = useState([]);

    // 로딩 상태
    const [loading, setLoading] = useState(true);

    // 카테고리 번호 바뀔 때마다 상품 목록 가져오기
    useEffect(() => {
        const fetchList = async () => {
            setLoading(true);
            const token = getToken();
            try {
                const data = await apiCall(`/api/v1/product/list/category/${catCd}`, 'GET', null, token, false);
                setPrdList(data);
            } catch (err) {
                console.error('상품 목록 오류:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchList();
    }, [catCd]);

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