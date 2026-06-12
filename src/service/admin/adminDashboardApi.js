import { apiCall } from '../apiService';

export function getAdminDashboardSummary() {
    return apiCall.get('/api/admin/dashboard/summary');
}
