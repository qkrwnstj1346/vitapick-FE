import { apiCall } from '../apiService';

/* 장바구니 목록 조회 */
export function getCartList(userNum) {
    return apiCall(
        `/cart/${userNum}`,
        'GET',
        null,
        null,
        false
    );
}

/* 장바구니 담기 */
export function addCart(data) {
    return apiCall(
        '/cart',
        'POST',
        data,
        null,
        false
    );
}

/* 장바구니 수량 변경 */
export function updateCartQty(cartId, data) {
    return apiCall(
        `/cart/${cartId}/qty`,
        'PATCH',
        data,
        null,
        false
    );
}

/* 장바구니 선택 상태 변경 */
/* 체크박스 선택/해제 */
export function updateCartSelectedYn(cartId, data) {
    return apiCall(
        `/cart/${cartId}/selected`,
        'PATCH',
        data,
        null,
        false
    );
}

/* 장바구니 개별 삭제 */
export function deleteCart(cartId) {
    return apiCall(
        `/cart/${cartId}`,
        'DELETE',
        null,
        null,
        false
    );
}

/* 선택 상품 조회 */
export function getSelectedCartList(userNum) {
    return apiCall(
        `/cart/selected/${userNum}`,
        'GET',
        null,
        null,
        false
    );
}

/* 선택 상품 삭제 */
export function deleteSelectedCart(userNum) {
    return apiCall(
        `/cart/selected/${userNum}`,
        'DELETE',
        null,
        null,
        false
    );
}

/* 장바구니 전체 삭제 */
export function deleteAllCart(userNum) {
    return apiCall(
        `/cart/all/${userNum}`,
        'DELETE',
        null,
        null,
        false
    );
}