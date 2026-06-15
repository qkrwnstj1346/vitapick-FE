import { apiCall } from '../apiService';

/* 주문 목록 조회 */
export function getOrderList() {
    return apiCall.get('/order');
}

/* 주문서 배송지 목록 조회 */
export function getOrderAddressList() {
    return apiCall.get('/address');
}

/* 주문서 기본 배송지 조회 */
export function getOrderBaseAddress() {
    return apiCall.get('/address/base');
}

/* 주문서 배송지 등록 */
export function createOrderAddress(data) {
    return apiCall.post('/address', data);
}

/* 주문 생성 */
export function createOrder(data) {
    return apiCall.post('/order', data);
}

/* 주문 완료 조회 */
export function getOrderComplete(ordNo) {
    return apiCall.get(`/order/complete/${ordNo}`);
}

/* 주문상품 목록 조회 */
export function getOrderItems(ordId) {
    return apiCall.get(`/order/${ordId}/items`);
}

/* 주문 결제 조회 */
export function getOrderPay(ordId) {
    return apiCall.get(`/order/pay/order/${ordId}`);
}

/* 주문번호로 주문 상세 조회 */
export function getOrderDetail(ordNo) {
    return apiCall.get(`/order/${ordNo}`);
}

// 상품별 판매량 TOP5 조회
export const getTopProducts = async () => {
    const response = await axios.get('/order/top-products');
    return response.data;
};