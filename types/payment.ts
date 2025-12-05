/**
 * @file types/payment.ts
 * @description 결제 관련 TypeScript 타입 정의
 *
 * Toss Payments 결제 위젯 및 결제 처리 관련 타입 정의입니다.
 */

/**
 * Toss Payments 결제 요청 파라미터
 */
export interface PaymentRequestParams {
  /** 주문 ID */
  orderId: string;
  /** 주문명 */
  orderName: string;
  /** 고객 이메일 */
  customerEmail: string;
  /** 고객 이름 */
  customerName: string;
  /** 고객 전화번호 */
  customerMobilePhone: string;
  /** 결제 성공 시 리다이렉트 URL */
  successUrl: string;
  /** 결제 실패 시 리다이렉트 URL */
  failUrl: string;
}

/**
 * 결제 성공 콜백 파라미터
 */
export interface PaymentSuccessParams {
  /** 주문 ID */
  orderId: string;
  /** 결제 키 */
  paymentKey: string;
  /** 결제 금액 */
  amount: number;
}

/**
 * 결제 실패 콜백 파라미터
 */
export interface PaymentFailParams {
  /** 에러 코드 */
  code: string;
  /** 에러 메시지 */
  message: string;
  /** 주문 ID */
  orderId: string;
}

