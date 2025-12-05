/**
 * @file components/orders/order-detail-header.tsx
 * @description 주문 상세 페이지 헤더 컴포넌트
 *
 * 주문 번호, 날짜, 상태를 표시하는 헤더 컴포넌트입니다.
 */

import { Order } from "@/types/order";
import {
  formatOrderStatus,
  getOrderStatusColor,
  formatOrderDateTime,
} from "@/lib/utils/order";
import { cn } from "@/lib/utils";

interface OrderDetailHeaderProps {
  order: Order;
}

/**
 * 주문 상세 헤더 컴포넌트
 */
export default function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  const statusColor = getOrderStatusColor(order.status);
  const statusText = formatOrderStatus(order.status);
  const orderDateTime = formatOrderDateTime(order.created_at);

  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">주문 상세</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            주문 번호: {order.id}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium",
            statusColor
          )}
        >
          {statusText}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">
        주문 일시: {orderDateTime}
      </div>
    </div>
  );
}

