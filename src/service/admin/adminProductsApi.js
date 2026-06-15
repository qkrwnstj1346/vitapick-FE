import { apiCall } from '../apiService';

export function getAdminProducts(params) {
    return apiCall.get('/api/admin/products', { params });
}
