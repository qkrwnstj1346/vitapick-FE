import { apiCall } from '../apiService';

export function getAdminReviews(params) {
    return apiCall.get('/api/admin/reviews', { params });
}

export function getAdminReviewDetail(rvwId) {
    return apiCall.get(`/api/admin/reviews/${rvwId}`);
}

export function saveAdminReviewReply(rvwId, payload) {
    return apiCall.patch(`/api/admin/reviews/${rvwId}/reply`, payload);
}

export function deleteAdminReviewReply(rvwId) {
    return apiCall.delete(`/api/admin/reviews/${rvwId}/reply`);
}
