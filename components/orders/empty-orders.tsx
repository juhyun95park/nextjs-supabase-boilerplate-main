/**
 * @file components/orders/empty-orders.tsx
 * @description 빈 주문 내역 컴포넌트
 *
 * 주문 내역이 없을 때 표시하는 컴포넌트입니다.
 * EmptyState 컴포넌트를 사용하여 일관된 UI를 제공합니다.
 */

import { EmptyState } from "@/components/ui/empty-state";
import { PackageX } from "lucide-react";

/**
 * 빈 주문 내역 컴포넌트
 */
export default function EmptyOrders() {
  return (
    <EmptyState
      icon={<PackageX className="h-20 w-20 text-muted-foreground" />}
      title="주문 내역이 없습니다"
      description="아직 주문한 상품이 없습니다. 지금 쇼핑을 시작해보세요!"
      actionLabel="상품 보러가기"
      actionHref="/products"
    />
  );
}

