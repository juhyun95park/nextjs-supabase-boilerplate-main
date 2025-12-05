/**
 * @file components/checkout/order-summary.tsx
 * @description 주문 요약 컴포넌트
 *
 * 주문 페이지에서 주문 상품 목록과 총 금액을 표시하는 컴포넌트입니다.
 */

import { CartItem } from "@/types/cart";
import { formatPrice } from "@/lib/utils/cart";
import { calculateTotalAmount } from "@/lib/utils/cart";

interface OrderSummaryProps {
  cartItems: CartItem[];
}

/**
 * 주문 요약 컴포넌트
 */
export default function OrderSummary({ cartItems }: OrderSummaryProps) {
  const totalAmount = calculateTotalAmount(cartItems);

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">주문 상품</h2>
      <div className="space-y-4">
        {cartItems.map((item) => {
          const itemTotal = item.product.price * item.quantity;
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{item.product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.product.price)} × {item.quantity}개
                </p>
              </div>
              <p className="font-semibold">{formatPrice(itemTotal)}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between text-lg font-bold">
          <span>총 결제금액</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

