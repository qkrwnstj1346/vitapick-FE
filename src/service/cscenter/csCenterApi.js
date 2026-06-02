import { apiCall } from '../apiService';

/* 공지사항 */

/* 공지사항 목록 조회 */
/* 일반 회원: use_yn = Y */
export function getNoticeList() {
    return apiCall.get('/cscenter/notices');
}

/* 공지사항 목록 조회 */
/* 관리자: use_yn = Y/N 전체 */
export function getAdminNoticeList() {
    return apiCall.get('/cscenter/admin/notices');
}

/* 공지사항 상세 조회 */
export function getNoticeDetail(ntcId) {
    return apiCall.get(`/cscenter/notices/${ntcId}`);
}

/* 공지사항 등록 */
/* 관리자 */
export function createNotice(data) {
    return apiCall.post(
        '/cscenter/admin/notices',
        data
    );
}

/* 공지사항 수정 */
/* 관리자 */
export function updateNotice(ntcId, data) {
    return apiCall.patch(
        `/cscenter/admin/notices/${ntcId}`,
        data
    );
}

/* 공지사항 삭제 */
/* 관리자 */
export function deleteNotice(ntcId) {
    return apiCall.delete(
        `/cscenter/admin/notices/${ntcId}`
    );
}

/* FAQ */

/* FAQ 전체 목록 조회 */
/* 관리자 */
export function getFaqList() {
    return apiCall.get('/faqs');
}

/* FAQ 사용여부 Y 목록 조회 */
/* 일반 회원 */
export function getUseYnFaqList() {
    return apiCall.get('/faqs/useyn/Y');
}

/* FAQ 카테고리별 조회 */
export function getFaqListByCategory(faqCtgCd) {
    return apiCall.get(
        `/faqs?faqCtgCd=${faqCtgCd}`
    );
}

/* FAQ 상세 조회 */
export function getFaqDetail(faqId) {
    return apiCall.get(`/faqs/${faqId}`);
}

/* FAQ 등록 */
/* 관리자 */
export function createFaq(data) {
    return apiCall.post(
        '/faqs',
        data
    );
}

/* FAQ 수정 */
/* 관리자 */
export function updateFaq(faqId, data) {
    return apiCall.patch(
        `/faqs/${faqId}`,
        data
    );
}

/* FAQ 삭제 */
/* 관리자 */
export function deleteFaq(faqId) {
    return apiCall.delete(
        `/faqs/${faqId}`
    );
}

/* 1:1 문의 */

/* 전체 문의 목록 조회 */
/* 관리자 */
export function getAllInq() {
    return apiCall.get('/inquiries');
}

/* 마이페이지 내 문의 목록 조회 */
/* 본인 문의만 */
export function getMyInq(userNum) {
    return apiCall.get(
        `/mypage/inquiries/${userNum}`
    );
}

/* 관리자 문의 상세 조회 */
export function getInqDetail(inqId) {
    return apiCall.get(
        `/inquiries/${inqId}`
    );
}

/* 회원 본인 문의 상세 조회 */
export function getMyInqDetail(inqId, userNum) {
    return apiCall.get(
        `/inquiries/${inqId}/${userNum}`
    );
}

/* 문의 등록 */
/* USER만 가능 */
export function createInq(data) {
    return apiCall.post(
        '/inquiries',
        data
    );
}

/* 문의 수정 */
/* 작성자만 가능 */
export function updateInq(inqId, userNum, data) {
    return apiCall.patch(
        `/inquiries/${inqId}/${userNum}`,
        data
    );
}

/* 문의 삭제 */
/* 작성자만 가능 */
export function deleteInq(inqId, userNum) {
    return apiCall.delete(
        `/inquiries/${inqId}/${userNum}`
    );
}

/* 관리자 답변 등록 */
/* ADMIN만 가능 */
export function answerInq(inqId, ansTxt) {
    return apiCall.patch(
        `/inquiries/${inqId}/answer`,
        {
            ansTxt
        }
    );
}