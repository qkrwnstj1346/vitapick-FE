import { API_BASE_URL } from "./app-config";
import axios from "axios";

// 1. axios 요청 함수
export async function apiCall(url, method, requestData, token, isMultipart) {

    // 1.1) headers 설정
    let headers = '';
    if (isMultipart) {
        // 이미지 포함 요청
        headers = {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token
        };
    } else if (token !== null && token !== undefined) {
        // 토큰 있는 일반 요청
        headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        };
    } else {
        // 토큰 없는 일반 요청
        headers = { 'Content-Type': 'application/json' };
    }

    // 1.2) axios 옵션
    let options = {
        url: API_BASE_URL + url,
        method: method,
        headers: headers,
    };

    // 1.3) 전송할 데이터 있으면 추가
    if (requestData) {
        options.data = requestData;
    }

    console.log(`** apiCall method=${options.method}`);
    console.log(`** apiCall url=${options.url}`);

    // 1.4) axios 요청
    return await axios(options)
        .then(response => {
            return response.data;
        })
        .catch(err => {
            console.error(`** apiCall Error status=${err.response.status}`);
            return Promise.reject(err.response.status);
        });
}

// 2. 토큰 저장
export function saveToken(token) {
    localStorage.setItem("token", token);
}

// 3. 토큰 꺼내기
export function getToken() {
    return localStorage.getItem("token");
}

// 4. 토큰 삭제(로그아웃)
export function removeToken() {
    localStorage.removeItem("token");
}

// 5. localStorage 데이터 꺼내기
export function getLocalData(key) {
    const data = localStorage.getItem(key);
    if (data !== null) return JSON.parse(data);
    else return null;
}

// 6. sessionStorage 데이터 꺼내기
export function getSessionData(key) {
    const data = sessionStorage.getItem(key);
    if (data !== null) return JSON.parse(data);
    else return null;
}