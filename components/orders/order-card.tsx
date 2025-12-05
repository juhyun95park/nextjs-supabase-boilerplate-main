/**
 * @file components/orders/order-card.tsx
 * @description 주문 카드 컴포넌트
 *
 * 주문 내역 목록에서 개별 주문을 카드 형태로 표시하는 컴포넌트입니다.
 */

import Link from "next/link";
import { Order } from "@/types/order";
import { formatOrderStatus, getOrderStatusColor, formatOrderDate } from "@/lib/utils/order";
import { formatPrice } from "@/lib/utils/cart";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface OrderCardProps {
  order: Order;
}

/**
 * 주문 카드 컴포넌트
 */
export default function OrderCard({ order }: OrderCardProps) {
  const statusColor = getOrderStatusColor(order.status);
  const statusText = formatOrderStatus(order.status);
  const orderDate = formatOrderDate(order.created_at);

  return (
    <Link
      href={`/orders/${order.id}`}
      className={cn(
        "group flex flex-col rounded-lg border bg-card p-6 shadow-sm transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.01]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 주문 번호 및 날짜 */}
          <div className="mb-2 flex items-center gap-4">
            <h3 className="font-semibold">주문 #{order.id.slice(0, 8)}</h3>
            <span className="text-sm text-muted-foreground">{orderDate}</span>
          </div>

          {/* 주문 상태 */}
          <div className="mb-4">
            <span
              className={cn(
                "inline-block rounded-full px-3 py-1 text-xs font-medium",
                statusColor
              )}
            >
              {statusText}
            </span>
          </div>

          {/* 주문 총액 */}
          <div className="text-lg font-bold">
            {formatPrice(order.total_amount)}
          </div>
        </div>

        {/* 화살표 아이콘 */}
        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

