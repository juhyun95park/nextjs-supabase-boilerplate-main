/**
 * @file types/order.ts
 * @description 주문 관련 TypeScript 타입 정의
 *
 * Supabase orders, order_items 테이블의 구조를 반영합니다.
 */

/**
 * 배송 주소 정보
 */
export interface ShippingAddress {
  /** 수령인 이름 */
  recipientName: string;
  /** 전화번호 */
  phone: string;
  /** 우편번호 */
  postalCode: string;
  /** 기본 주소 */
  address: string;
  /** 상세 주소 */
  detailAddress: string;
}

/**
 * 주문 상태
 */
export type OrderStatus =
  | "pending" // 대기 중
  | "confirmed" // 확인됨
  | "shipped" // 배송 중
  | "delivered" // 배송 완료
  | "cancelled"; // 취소됨

/**
 * 주문 정보 (orders 테이블)
 */
export interface Order {
  /** 주문 고유 ID */
  id: string;
  /** Clerk 사용자 ID */
  clerk_id: string;
  /** 총 주문 금액 */
  total_amount: number;
  /** 주문 상태 */
  status: OrderStatus;
  /** 배송 주소 (JSONB) */
  shipping_address: ShippingAddress | null;
  /** 주문 메모 */
  order_note: string | null;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * 주문 상세 아이템 (order_items 테이블)
 */
export interface OrderItem {
  /** 주문 상세 아이템 고유 ID */
  id: string;
  /** 주문 ID */
  order_id: string;
  /** 상품 ID */
  product_id: string;
  /** 상품명 (주문 시점의 상품명 저장) */
  product_name: string;
  /** 수량 */
  quantity: number;
  /** 가격 (주문 시점의 가격 저장) */
  price: number;
  /** 생성 일시 */
  created_at: string;
}

/**
 * 주문 상세 정보 (Order + OrderItem[])
 */
export interface OrderDetail extends Order {
  /** 주문 상세 아이템 목록 */
  items: OrderItem[];
}

/**
 * 주문 폼 입력 데이터
 */
export interface OrderFormData {
  /** 배송 주소 */
  shippingAddress: ShippingAddress;
  /** 주문 메모 (선택사항) */
  orderNote?: string;
}

/**
 * 주문 생성 결과
 */
export interface CreateOrderResult {
  /** 생성된 주문 ID */
  orderId: string;
  /** 주문 총액 */
  totalAmount: number;
  /** 주문 상태 */
  status: OrderStatus;
}

