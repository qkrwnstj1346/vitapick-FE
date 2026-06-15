import { apiCall } from '../apiService';

export function getAdminUsers(params) {
    return apiCall.get('/api/admin/users', { params });
}
