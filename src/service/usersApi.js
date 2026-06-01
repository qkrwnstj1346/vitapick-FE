import {apiCall, refreshapi} from "./apiService";

export const UsersApi={
    //로그인
    login: async (loginId, pwd)=>{
        console.log(apiCall);
        const loginData = {
            loginId: loginId,
            pwd: pwd,
        };
        const result = await apiCall.post(`/v1/auth/login`, loginData, {withCredentials: true,});
        console.log(`** login, result.data =${result.data}`)
        return result.data;
    },

    //로그아웃
    logout: async () => {
        const result = await apiCall.get(`/v1/auth/logout`, {withCredentials: true,});
        return result.data;
    },

    //리프레쉬 가져오기기
    //-> response 인터셉터에서 제외시켜야 하므로 별도의 인스턴스_refreshapi 사용
    getRefresh: async () => {
        const result = await refreshapi.get(`/auth/getrefresh`, {withCredentials: true,});
        return result.data;
    },

    //Server Data 요청
    //=> userdetail, memberlist, boardlist 
    getServerData: async (url) => {
        const result = await apiCall.get(url);
        return result.data;
    },
};

export default UsersApi;