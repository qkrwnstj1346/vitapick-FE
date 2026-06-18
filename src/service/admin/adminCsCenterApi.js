import { apiCall } from '../apiService';

// 관리자 공지사항 목록 조회 API
export function getAdminCsNotices(params) {
    return apiCall.get('/api/admin/cscenter/notices', { params });
}

// 관리자 FAQ 목록 조회 API
export function getAdminCsFaqs(params) {
    return apiCall.get('/api/admin/cscenter/faqs', { params });
}

// 관리자 FAQ 등록 API
export function createAdminCsFaq(data) {
    return apiCall.post('/api/admin/cscenter/faqs', data);
}

// 관리자 FAQ 수정 API
export function updateAdminCsFaq(faqId, data) {
    return apiCall.patch(`/api/admin/cscenter/faqs/${faqId}`, data);
}

// 관리자 1:1 문의 목록 조회 API
export function getAdminCsInquiries(params) {
    return apiCall.get('/api/admin/cscenter/inquiries', { params });
}

// 관리자 1:1 문의 상세 조회 API
export function getAdminCsInquiryDetail(inqId) {
    return apiCall.get(`/api/admin/cscenter/inquiries/${inqId}`);
}

// 관리자 1:1 문의 답변 저장 API
export function saveAdminCsInquiryAnswer(inqId, data) {
    return apiCall.patch(`/api/admin/cscenter/inquiries/${inqId}/answer`, data);
}
