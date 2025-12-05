/**
 * @file components/products/add-to-cart-button.tsx
 * @description 장바구니 담기 버튼 컴포넌트
 *
 * 상품 상세 페이지에서 사용하는 장바구니 담기 버튼입니다.
 * 로딩 상태와 성공/실패 피드백을 제공합니다.
 */

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { addToCart } from "@/actions/cart";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
  disabled?: boolean;
  stockQuantity: number;
}

/**
 * 장바구니 담기 버튼 컴포넌트
 */
export default function AddToCartButton({
  productId,
  disabled = false,
  stockQuantity,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = () => {
    if (disabled || stockQuantity === 0) {
      return;
    }

    startTransition(async () => {
      const result = await addToCart(productId, 1);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Button
      size="lg"
      className="w-full gap-2"
      disabled={disabled || stockQuantity === 0 || isPending}
      onClick={handleAddToCart}
    >
      {isPending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          추가 중...
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5" />
          {stockQuantity === 0 ? "품절" : "장바구니에 담기"}
        </>
      )}
    </Button>
  );
}

