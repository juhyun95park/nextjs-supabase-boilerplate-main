/**
 * @file components/cart/cart-summary.tsx
 * @description 장바구니 요약 컴포넌트
 *
 * 장바구니의 총 상품 수량, 총 금액을 표시하고 주문하기 버튼을 제공합니다.
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartSummary as CartSummaryType } from "@/types/cart";
import { formatPrice } from "@/lib/utils/cart";
import { ShoppingBag } from "lucide-react";

interface CartSummaryProps {
  summary: CartSummaryType;
}

/**
 * 장바구니 요약 컴포넌트
 */
export default function CartSummary({ summary }: CartSummaryProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">주문 요약</h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">총 상품 수량</span>
          <span className="font-medium">{summary.totalQuantity}개</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">총 상품 금액</span>
          <span className="font-medium">{formatPrice(summary.totalAmount)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span>총 결제금액</span>
            <span>{formatPrice(summary.totalAmount)}</span>
          </div>
        </div>
      </div>
      <Link href="/checkout" className="mt-6 block">
        <Button size="lg" className="w-full gap-2">
          <ShoppingBag className="h-5 w-5" />
          주문하기
        </Button>
      </Link>
    </div>
  );
}

