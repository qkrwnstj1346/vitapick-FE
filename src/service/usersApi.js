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
        console.log(`** login, result.data =`)
        return result;
    },

    //로그아웃
    logout: async () => {
        const result = await apiCall.get(`/v1/auth/logout`, {withCredentials: true,});
        return result;
    },

    //Server Data 요청
    //=> userdetail, memberlist, boardlist 
    getServerData: async (url) => {
        const result = await apiCall.get(url);
        return result;
    },
};

export default UsersApi;