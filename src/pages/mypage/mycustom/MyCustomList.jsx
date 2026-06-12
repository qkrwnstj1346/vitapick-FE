import { useEffect } from "react";
import { apiCall } from "../../../service/apiService";

function MyCustomList(){
    useEffect(async()=>{
        const result = await apiCall.get(`/v1/custom/list`);
        console.log(result);
    })
}

export default MyCustomList;