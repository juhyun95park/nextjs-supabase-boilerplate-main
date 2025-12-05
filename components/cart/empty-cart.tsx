/**
 * @file components/cart/empty-cart.tsx
 * @description 빈 장바구니 컴포넌트
 *
 * 장바구니가 비어있을 때 표시하는 컴포넌트입니다.
 * EmptyState 컴포넌트를 사용하여 일관된 UI를 제공합니다.
 */

import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";

/**
 * 빈 장바구니 컴포넌트
 */
export default function EmptyCart() {
  return (
    <EmptyState
      icon={<ShoppingBag className="h-16 w-16 text-muted-foreground" />}
      title="장바구니가 비어있습니다"
      description="원하는 상품을 장바구니에 담아보세요."
      actionLabel="상품 보러가기"
      actionHref="/products"
    />
  );
}

