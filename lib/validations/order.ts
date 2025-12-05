/**
 * @file lib/validations/order.ts
 * @description 주문 관련 Zod 검증 스키마
 *
 * 주문 폼, 배송 주소, 주문 메모 등의 검증 스키마를 정의합니다.
 */

import { z } from "zod";

/**
 * 배송 주소 검증 스키마
 */
export const shippingAddressSchema = z.object({
  recipientName: z
    .string()
    .min(1, "수령인 이름을 입력해주세요.")
    .max(50, "수령인 이름은 50자 이하여야 합니다."),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요.")
    .regex(/^[0-9-]+$/, "올바른 전화번호 형식이 아닙니다.")
    .max(20, "전화번호는 20자 이하여야 합니다."),
  postalCode: z
    .string()
    .min(1, "우편번호를 입력해주세요.")
    .regex(/^[0-9-]+$/, "올바른 우편번호 형식이 아닙니다.")
    .max(10, "우편번호는 10자 이하여야 합니다."),
  address: z
    .string()
    .min(1, "주소를 입력해주세요.")
    .max(200, "주소는 200자 이하여야 합니다."),
  detailAddress: z
    .string()
    .min(1, "상세 주소를 입력해주세요.")
    .max(200, "상세 주소는 200자 이하여야 합니다."),
});

/**
 * 주문 폼 검증 스키마
 */
export const orderFormSchema = z.object({
  shippingAddress: shippingAddressSchema,
  orderNote: z
    .string()
    .max(500, "주문 메모는 500자 이하여야 합니다.")
    .optional(),
});

/**
 * 주문 ID 검증 스키마
 */
export const orderIdSchema = z.string().uuid("올바른 주문 ID 형식이 아닙니다.");

/**
 * 주문 상태 검증 스키마
 */
export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
]);

/**
 * 주문 생성 입력 검증 스키마
 */
export const createOrderInputSchema = z.object({
  shippingAddress: shippingAddressSchema,
  orderNote: z.string().max(500).optional(),
});

/**
 * 주문 상태 업데이트 입력 검증 스키마
 */
export const updateOrderStatusInputSchema = z.object({
  orderId: orderIdSchema,
  status: orderStatusSchema,
});

/**
 * 결제 확인 입력 검증 스키마
 */
export const confirmPaymentInputSchema = z.object({
  orderId: orderIdSchema,
  paymentKey: z.string().min(1, "결제 키가 필요합니다."),
  amount: z.number().positive("결제 금액은 0보다 커야 합니다."),
});

/**
 * 결제 취소 입력 검증 스키마
 */
export const cancelPaymentInputSchema = z.object({
  orderId: orderIdSchema,
});

// 타입 추출
export type ShippingAddressInput = z.infer<typeof shippingAddressSchema>;
export type OrderFormInput = z.infer<typeof orderFormSchema>;
export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusInputSchema>;
export type ConfirmPaymentInput = z.infer<typeof confirmPaymentInputSchema>;
export type CancelPaymentInput = z.infer<typeof cancelPaymentInputSchema>;

