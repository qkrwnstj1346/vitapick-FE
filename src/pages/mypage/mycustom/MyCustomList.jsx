import { useEffect } from "react";
import { apiCall } from "../../../service/apiService";

function MyCustomList(){
    async function CallMyCustomList(){
        try{
            const data = apiCall.get('v1/cus/list');
            
        }catch(err){
            console.error('Custom 목록 불러오기 오류', err)
        }
    }







}
export default MyCustomList;