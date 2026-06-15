import { useEffect } from "react";
import { apiCall } from "../../../service/apiService";

function MyCustomList(){

    const userNum = sessionStorage.getItem('userNum');


    useEffect(()=>{
    async function loadMyCustomList(){
        try{
            const result = apiCall.get('v1/cus/list/');
            console.log(result);
        }catch(err){
            console.error('Custom 목록 불러오기 오류', err)
        }
    }
    loadMyCustomList();
    },[])


    return(
        <h2>커스텀 리스트</h2>



    );
}
export default MyCustomList;