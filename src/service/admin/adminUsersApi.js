import { apiCall } from '../apiService';

export function getAdminUsers(params) {
    return apiCall.get('/api/admin/users', { params });
}

// Excel download UserList
export function downloadAdminUsersExcel(params) {
    return apiCall.get('/api/admin/users/excel', {
        params,
        responseType: 'blob'
    });
}
