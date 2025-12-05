/**
 * @file lib/validations/cart.ts
 * @description 장바구니 관련 Zod 검증 스키마
 *
 * 장바구니 아이템 추가, 수량 변경 등의 검증 스키마를 정의합니다.
 */

import { z } from "zod";

/**
 * 상품 ID 검증 스키마
 */
export const productIdSchema = z.string().uuid("올바른 상품 ID 형식이 아닙니다.");

/**
 * 장바구니 아이템 ID 검증 스키마
 */
export const cartItemIdSchema = z.string().uuid("올바른 장바구니 아이템 ID 형식이 아닙니다.");

/**
 * 수량 검증 스키마
 */
export const quantitySchema = z
  .number()
  .int("수량은 정수여야 합니다.")
  .positive("수량은 1개 이상이어야 합니다.")
  .max(999, "수량은 999개 이하여야 합니다.");

/**
 * 장바구니에 상품 추가 입력 검증 스키마
 */
export const addToCartInputSchema = z.object({
  productId: productIdSchema,
  quantity: quantitySchema.default(1),
});

/**
 * 장바구니 수량 변경 입력 검증 스키마
 */
export const updateCartQuantityInputSchema = z.object({
  cartItemId: cartItemIdSchema,
  quantity: quantitySchema,
});

/**
 * 장바구니 아이템 삭제 입력 검증 스키마
 */
export const removeFromCartInputSchema = z.object({
  cartItemId: cartItemIdSchema,
});

// 타입 추출
export type AddToCartInput = z.infer<typeof addToCartInputSchema>;
export type UpdateCartQuantityInput = z.infer<typeof updateCartQuantityInputSchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartInputSchema>;

