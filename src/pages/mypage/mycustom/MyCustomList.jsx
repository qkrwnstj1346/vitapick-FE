import { useEffect, useState } from "react";
import { apiCall } from "../../../service/apiService";
import { Link, useNavigate } from "react-router-dom";


function MyCustomList(){

    const navigate = useNavigate();
    const [cusList, setCusList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 10;
    const totalPage = Math.ceil(cusList.length / itemPerPage);
    const startIndex = (currentPage - 1) * itemPerPage;

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

    return(
            
            <table>
                <thead>
                    <tr>
                        <th>설문자ID</th><th>커스텀번호</th><th>제목</th><th>작성일</th>
                    </tr>
                </thead>

                <tbody>
                    {cusList.length > 0 ? (
                        cusList.map((cus) => (
                            <tr key={cus.cusId}>
                                <td>
                                    {sessionStorage.getItem('loginId')}
                                </td>
                                <td>
                                    {cus.cusId}
                                </td>
                                <td>
                                    <Link to={`/v1/cus/result/${cus.cusId}`}>
                                    {cus.surTitle}
                                    </Link>
                                </td>
                                <td>
                                    {cus.crtAt}
                                </td>
                            </tr>
                        ))
                    ) : (

                        <tr>

                            <td>
                                '등록된 FAQ가 없습니다.'
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

    );
}
export default MyCustomList;