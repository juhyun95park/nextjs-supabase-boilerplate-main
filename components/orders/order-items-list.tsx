/**
 * @file components/orders/order-items-list.tsx
 * @description 주문 상품 목록 컴포넌트
 *
 * 주문에 포함된 상품 목록을 테이블 형태로 표시하는 컴포넌트입니다.
 */

import { OrderItem } from "@/types/order";
import { formatPrice } from "@/lib/utils/cart";
import Link from "next/link";

interface OrderItemsListProps {
  items: OrderItem[];
}

/**
 * 주문 상품 목록 컴포넌트
 */
export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div className="rounded-lg border bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">주문 상품</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">상품명</th>
              <th className="px-4 py-3 text-center text-sm font-medium">수량</th>
              <th className="px-4 py-3 text-right text-sm font-medium">단가</th>
              <th className="px-4 py-3 text-right text-sm font-medium">소계</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;
              return (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-3">
                    <Link
                      href={`/products/${item.product_id}`}
                      className="font-medium hover:text-primary"
                    >
                      {item.product_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">
                    {formatPrice(itemTotal)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

