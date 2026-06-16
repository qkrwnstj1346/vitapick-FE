import { useEffect, useState } from "react";
import { apiCall } from "../../../service/apiService";
import { Link, useNavigate } from "react-router-dom";
import Pagination from '../../../components/layout/Pagination';

import '../../cscenter/faq/FaqList.css';

function MyCustomList(){

    const navigate = useNavigate();
    const [cusList, setCusList] = useState([]);
    /* 현재 페이지 */
    const [currentPage, setCurrentPage] = useState(1);
    /* 페이지당 개수 */
    const itemPerPage = 10;
    /* 전체 페이지 */
    const totalPage = Math.ceil(cusList.length / itemPerPage);
    /* 시작 인덱스 */
    const startIndex = (currentPage - 1) * itemPerPage;
    const pagedList = cusList.slice(startIndex, startIndex+itemPerPage);
    
    useEffect(()=>{
        async function loadMyCustomList(){
            if(!sessionStorage.getItem('accessToken')){
                alert('로그인이 필요합니다');
                navigate('/v1/auth/login');
            }
            try{
                const result = await apiCall.get('v1/cus/list/');
                console.log(result);
                setCusList(result);
            }catch(err){
                console.error('Custom 목록 불러오기 오류', err)
            }
        }
        loadMyCustomList();
        },[])
    
    // 커스텀 삭제버튼
    async function handleDelete(cusId) {
        if(!window.confirm("삭제하시겠습니까?"))return;
        try{
            await apiCall.delete(`v1/cus/delete/${cusId}`);
            //삭제 후 다시 리스트 셋업
            const result = await apiCall.get(`v1/cus/list/`);
            setCusList(result);
        }catch(err){
            console.error('삭제오류', err);
            alert('삭제에 실패했습니다.');
        }
    }

    return(
        <div className="cs-faq-wrap">
            <div className="cs-faq-header">
                <h2>내 영양제 추천 보기</h2>
            </div>        
            <table className="cs-faq-table">
                <thead>
                    <tr>
                        <th width='15%'>설문자ID</th>
                        <th width='15%'>커스텀번호</th>
                        <th width='35%'>제목</th>
                        <th width='20%'>작성일</th>
                        <th width='15%'>상세보기/삭제</th>
                    </tr>
                </thead>

                <tbody>
                    {pagedList.length > 0 ? (
                        pagedList.map((cus) => (
                            <tr key={cus.cusId}>
                                <td>{sessionStorage.getItem('loginId')}</td>
                                <td>{cus.cusId}</td>
                                <td>
                                    <Link to={`/v1/cus/result/${cus.cusId}`}>
                                    {cus.surTitle}
                                    </Link>
                                </td>
                                <td>{cus.crtAt}</td>
                                <td>
                                    <Link to={`/v1/cus/result/${cus.cusId}`}>
                                        <button>상세보기</button>
                                    </Link>
                                    <button onClick={()=>handleDelete(cus.cusId)}>삭제</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan='5' className="cs-faq-empty">'등록된 FAQ가 없습니다.'</td>
                        </tr>
                    )}
                </tbody>
            </table>
            
            <Pagination
                currentPage={currentPage}
                totalPage={totalPage}
                onPageChange={setCurrentPage}
            />

        </div>
    );
}
export default MyCustomList;