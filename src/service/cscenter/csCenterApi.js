import { apiCall } from '../apiService';

/* 공지사항 목록 조회 */
/* 일반 회원: use_yn = Y */
export function getNoticeList() {
    return apiCall(
        '/cscenter/notices',
        'GET',
        null,
        null,
        false
    );
}

/* 공지사항 목록 조회 */
/* 관리자: use_yn = Y/N 전체 */
export function getAdminNoticeList() {
    return apiCall(
        '/cscenter/admin/notices',
        'GET',
        null,
        null,
        false
    );
}

/* 공지사항 상세 조회 */
export function getNoticeDetail(ntcId) {
    return apiCall(
        `/cscenter/notices/${ntcId}`,
        'GET',
        null,
        null,
        false
    );
}

/* 공지사항 등록 */
/* 관리자 */
export function createNotice(data) {
    return apiCall(
        '/cscenter/admin/notices',
        'POST',
        data,
        null,
        false
    );
}

/* 공지사항 수정 */
/* 관리자 */
export function updateNotice(ntcId, data) {
    return apiCall(
        `/cscenter/admin/notices/${ntcId}`,
        'PATCH',
        data,
        null,
        false
    );
}

/* 공지사항 삭제 */
/* 관리자 */
export function deleteNotice(ntcId) {
    return apiCall(
        `/cscenter/admin/notices/${ntcId}`,
        'DELETE',
        null,
        null,
        false
    );
}

/* FAQ 전체 목록 조회 */
/* 관리자: 전체 FAQ */
export function getFaqList() {
    return apiCall(
        '/faqs',
        'GET',
        null,
        null,
        false
    );
}

/* FAQ 사용여부 Y 목록 조회 */
/* 일반 회원 */
export function getUseYnFaqList() {
    return apiCall(
        '/faqs/useyn/Y',
        'GET',
        null,
        null,
        false
    );
}

/* FAQ 카테고리별 조회 */
export function getFaqListByCategory(faqCtgCd) {
    return apiCall(
        `/faqs?faqCtgCd=${faqCtgCd}`,
        'GET',
        null,
        null,
        false
    );
}

/* FAQ 상세 조회 */
export function getFaqDetail(faqId) {
    return apiCall(
        `/faqs/${faqId}`,
        'GET',
        null,
        null,
        false
    );
}

/* FAQ 등록 */
export function createFaq(data) {
    return apiCall(
        '/faqs',
        'POST',
        data,
        null,
        false
    );
}

/* FAQ 수정 */
export function updateFaq(faqId, data) {
    return apiCall(
        `/faqs/${faqId}`,
        'PATCH',
        data,
        null,
        false
    );
}

/* FAQ 삭제 */
export function deleteFaq(faqId) {
    return apiCall(
        `/faqs/${faqId}`,
        'DELETE',
        null,
        null,
        false
    );
}