/**
 * @file types/cart.ts
 * @description 장바구니 관련 TypeScript 타입 정의
 *
 * Supabase cart_items 테이블과 products 테이블을 조인한 데이터 구조를 정의합니다.
 */

import { Product } from "./product";

/**
 * 장바구니 아이템 (cart_items + products 조인)
 *
 * cart_items 테이블의 데이터와 products 테이블의 상품 정보를 함께 포함합니다.
 */
export interface CartItem {
  /** 장바구니 아이템 고유 ID (cart_items.id) */
  id: string;
  /** Clerk 사용자 ID */
  clerk_id: string;
  /** 상품 ID */
  product_id: string;
  /** 수량 */
  quantity: number;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
  /** 상품 정보 (products 테이블 조인) */
  product: Product;
}

/**
 * 장바구니 요약 정보
 */
export interface CartSummary {
  /** 총 상품 수량 */
  totalQuantity: number;
  /** 총 금액 */
  totalAmount: number;
  /** 장바구니 아이템 개수 */
  itemCount: number;
}

/**
 * 장바구니에 상품 추가 시 사용하는 데이터
 */
export interface AddToCartInput {
  /** 상품 ID */
  productId: string;
  /** 수량 (기본값: 1) */
  quantity?: number;
}

/**
 * 장바구니 수량 변경 시 사용하는 데이터
 */
export interface UpdateCartQuantityInput {
  /** 장바구니 아이템 ID */
  cartItemId: string;
  /** 변경할 수량 */
  quantity: number;
}

