import { apiCall } from '../apiService';

export function getAdminOrders(params) {
    return apiCall.get('/api/admin/orders', { params });
}
