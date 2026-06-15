import { apiCall } from '../apiService';

export function getAdminReviews(params) {
    return apiCall.get('/api/admin/reviews', { params });
}
