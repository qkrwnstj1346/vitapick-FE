import { apiCall } from '../apiService';

export function getAdminCsNotices(params) {
    return apiCall.get('/api/admin/cscenter/notices', { params });
}

export function getAdminCsFaqs(params) {
    return apiCall.get('/api/admin/cscenter/faqs', { params });
}

export function getAdminCsInquiries(params) {
    return apiCall.get('/api/admin/cscenter/inquiries', { params });
}
