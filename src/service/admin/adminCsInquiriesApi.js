import { apiCall } from '../apiService';

export function getAdminCsInquiries(params) {
    return apiCall.get('/api/admin/cs/inquiries', { params });
}
