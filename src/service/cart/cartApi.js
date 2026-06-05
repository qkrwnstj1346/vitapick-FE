import { apiCall } from '../apiService';

/* 장바구니 */

/* 장바구니 목록 조회 */
/* 로그인한 본인 장바구니만 */
export function getCartList() {
    return apiCall.get('/cart');
}

/* 장바구니 담기 */
/* 로그인한 본인 장바구니에 담기 */
export function addCart(data) {
    return apiCall.post('/cart', data);
}

/* 장바구니 수량 변경 */
export function updateCartQty(cartId, data) {
    return apiCall.patch(
        `/cart/${cartId}/qty`,
        data
    );
}

/* 장바구니 선택 상태 변경 */
/* 체크박스 선택/해제 */
export function updateCartSelectedYn(cartId, data) {
    return apiCall.patch(
        `/cart/${cartId}/selected`,
        data
    );
}

/* 전체 선택 / 전체 해제 */
export function updateAllCartSelectedYn(data) {
    return apiCall.patch(
        '/cart/selected/all',
        data
    );
}

/* 장바구니 개별 삭제 */
export function deleteCart(cartId) {
    return apiCall.delete(`/cart/${cartId}`);
}

/* 선택 상품 조회 */
/* 로그인한 본인 선택 상품만 */
export function getSelectedCartList() {
    return apiCall.get('/cart/selected');
}

/* 선택 상품 삭제 */
export function deleteSelectedCart() {
    return apiCall.delete('/cart/selected');
}

/* 장바구니 전체 삭제 */
export function deleteAllCart() {
    return apiCall.delete('/cart/all');
}