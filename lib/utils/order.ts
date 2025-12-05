/**
 * @file lib/utils/order.ts
 * @description 주문 관련 유틸리티 함수
 */

import type { ShippingAddress, OrderStatus } from "@/types/order";

/**
 * 배송 주소를 포맷팅된 문자열로 변환합니다.
 *
 * @param address - 배송 주소 객체
 * @returns 포맷팅된 주소 문자열
 */
export function formatShippingAddress(address: ShippingAddress): string {
  return `${address.address} ${address.detailAddress} (${address.postalCode})`;
}

/**
 * 주문 총액을 검증합니다.
 * 계산된 총액과 주문 총액이 일치하는지 확인합니다.
 *
 * @param calculatedTotal - 계산된 총액
 * @param orderTotal - 주문 총액
 * @returns 검증 결과
 */
export function validateOrderTotal(
  calculatedTotal: number,
  orderTotal: number
): boolean {
  // 소수점 오차를 고려하여 0.01원 이내 차이는 허용
  return Math.abs(calculatedTotal - orderTotal) < 0.01;
}

/**
 * 주문 상태를 한글로 변환합니다.
 *
 * @param status - 주문 상태
 * @returns 한글 주문 상태
 */
export function formatOrderStatus(status: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    pending: "결제 대기",
    confirmed: "결제 완료",
    shipped: "배송 중",
    delivered: "배송 완료",
    cancelled: "취소됨",
  };

  return statusMap[status] || status;
}

/**
 * 주문 상태별 색상을 반환합니다.
 *
 * @param status - 주문 상태
 * @returns Tailwind CSS 색상 클래스
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colorMap: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return colorMap[status] || "bg-gray-100 text-gray-800";
}

/**
 * 주문 날짜를 포맷팅합니다.
 *
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (예: "2025년 1월 15일")
 */
export function formatOrderDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 주문 날짜와 시간을 포맷팅합니다.
 *
 * @param dateString - ISO 날짜 문자열
 * @returns 포맷팅된 날짜 및 시간 문자열 (예: "2025년 1월 15일 오후 3:30")
 */
export function formatOrderDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}

