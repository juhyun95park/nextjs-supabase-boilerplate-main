/**
 * @file lib/utils/cart.ts
 * @description 장바구니 관련 유틸리티 함수
 */

import type { CartItem, CartSummary } from "@/types/cart";

/**
 * 장바구니 아이템 목록으로부터 총 금액을 계산합니다.
 *
 * @param items - 장바구니 아이템 목록
 * @returns 총 금액
 */
export function calculateTotalAmount(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
}

/**
 * 장바구니 아이템 목록으로부터 총 수량을 계산합니다.
 *
 * @param items - 장바구니 아이템 목록
 * @returns 총 수량
 */
export function calculateTotalQuantity(items: CartItem[]): number {
  return items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
}

/**
 * 장바구니 요약 정보를 계산합니다.
 *
 * @param items - 장바구니 아이템 목록
 * @returns 장바구니 요약 정보
 */
export function calculateCartSummary(items: CartItem[]): CartSummary {
  return {
    totalQuantity: calculateTotalQuantity(items),
    totalAmount: calculateTotalAmount(items),
    itemCount: items.length,
  };
}

/**
 * 가격을 한국 원화 형식으로 포맷팅합니다.
 *
 * @param price - 가격
 * @returns 포맷팅된 가격 문자열 (예: "1,000원")
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("ko-KR")}원`;
}

