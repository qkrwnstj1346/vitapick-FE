import { apiCall } from '../apiService';

/* 공지사항 */

/* 공지사항 목록 조회 */
/* 관리자: 전체 / 일반 회원: use_yn = Y */
export function getNoticeList() {
    return apiCall.get('/cscenter/notices');
}

/* 공지사항 상세 조회 */
export function getNoticeDetail(ntcId) {
    return apiCall.get(`/cscenter/notices/${ntcId}`);
}

/* 공지사항 등록 */
/* 관리자 */
export function createNotice(data) {
    return apiCall.post(
        '/cscenter/notices',
        data
    );
}

/* 공지사항 수정 */
/* 관리자 */
export function updateNotice(ntcId, data) {
    return apiCall.patch(
        `/cscenter/notices/${ntcId}`,
        data
    );
}

/* 공지사항 삭제 */
/* 관리자 */
export function deleteNotice(ntcId) {
    return apiCall.delete(
        `/cscenter/notices/${ntcId}`
    );
}

/* FAQ */

/* FAQ 전체 목록 조회 */
/* 관리자: 전체 / 일반 회원: use_yn = Y */
export function getFaqList() {
    return apiCall.get('/cscenter/faqs');
}

/* FAQ 카테고리별 조회 */
export function getFaqListByCategory(faqCtgCd) {
    return apiCall.get(
        `/cscenter/faqs?faqCtgCd=${faqCtgCd}`
    );
}

/* FAQ 상세 조회 */
export function getFaqDetail(faqId) {
    return apiCall.get(`/cscenter/faqs/${faqId}`);
}

/* FAQ 등록 */
/* 관리자 */
export function createFaq(data) {
    return apiCall.post(
        '/cscenter/faqs',
        data
    );
}

/* FAQ 수정 */
/* 관리자 */
export function updateFaq(faqId, data) {
    return apiCall.patch(
        `/cscenter/faqs/${faqId}`,
        data
    );
}

/* FAQ 삭제 */
/* 관리자 */
export function deleteFaq(faqId) {
    return apiCall.delete(
        `/cscenter/faqs/${faqId}`
    );
}

/* 1:1 문의 */

/* 전체 문의 목록 조회 */
/* 전체 사용자 조회 가능 */
export function getAllInq() {
    return apiCall.get('/cscenter/inquiries');
}

/* 마이페이지 내 문의 목록 조회 */
/* 로그인한 본인 문의만 */
export function getMyInq() {
    return apiCall.get('/cscenter/mypage/inquiries');
}

/* 문의 상세 조회 */
/* 관리자: 전체 / 회원: 본인 문의만 */
export function getInqDetail(inqId) {
    return apiCall.get(`/cscenter/inquiries/${inqId}`);
}

/* 회원 본인 문의 상세 조회 */
/* 기존 프론트 코드 호환용 */
export function getMyInqDetail(inqId) {
    return apiCall.get(`/cscenter/inquiries/${inqId}`);
}

/* 문의 등록 */
/* 로그인 회원만 가능 */
export function createInq(data) {
    return apiCall.post('/cscenter/inquiries', data);
}

/* 문의 수정 */
/* 작성자만 가능 */
export function updateInq(inqId, data) {
    return apiCall.patch(`/cscenter/inquiries/${inqId}`, data);
}

/* 문의 삭제 */
/* 작성자만 가능 */
export function deleteInq(inqId) {
    return apiCall.delete(`/cscenter/inquiries/${inqId}`);
}

/* 관리자 답변 등록 */
/* ADMIN만 가능 */
export function answerInq(inqId, ansTxt) {
    return apiCall.patch(
        `/cscenter/inquiries/${inqId}/answer`,
        { ansTxt }
    );
}