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
        setLoading(true);
        const token = getToken();
        apiCall(`/api/v1/product/list/category/${catCd}`, 'GET', null, token, false)
            .then(data => {
                setPrdList(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('상품 목록 오류:', err);
                setLoading(false);
            });
    }, [catCd]);

    if (loading) return <div className='prd_loading'>로딩 중...</div>;

    return (
        <div className='prd_container'>

            <div className='prd_list'>
                {prdList.map((prd) => (
                    <div key={prd.prdId} className='prd_card'>
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