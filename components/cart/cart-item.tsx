/**
 * @file components/cart/cart-item.tsx
 * @description 장바구니 아이템 컴포넌트
 *
 * 개별 장바구니 아이템을 표시하고 수량 변경 및 삭제 기능을 제공합니다.
 */

"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types/cart";
import { Button } from "@/components/ui/button";
import {
  updateCartItemQuantity,
  removeFromCart,
} from "@/actions/cart";
import { formatPrice } from "@/lib/utils/cart";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
}

/**
 * 장바구니 아이템 컴포넌트
 */
export default function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock_quantity) {
      toast.error(
        `재고가 부족합니다. (현재 재고: ${item.product.stock_quantity}개)`
      );
      return;
    }

    setQuantity(newQuantity);
    startTransition(async () => {
      const result = await updateCartItemQuantity(item.id, newQuantity);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
        setQuantity(item.quantity); // 실패 시 원래 수량으로 복원
      }
    });
  };

  const handleRemove = () => {
    if (!confirm("정말 이 상품을 장바구니에서 삭제하시겠습니까?")) {
      return;
    }

    startTransition(async () => {
      const result = await removeFromCart(item.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const itemTotal = item.product.price * quantity;
  const isOutOfStock = item.product.stock_quantity === 0;

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4">
      {/* 상품 이미지 */}
      <Link
        href={`/products/${item.product.id}`}
        className="relative aspect-square h-24 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted"
      >
        {/* TODO: 실제 상품 이미지 URL이 추가되면 Image 컴포넌트로 교체 */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <span className="text-2xl font-bold text-primary/30">
            {item.product.name.charAt(0)}
          </span>
        </div>
      </Link>

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              href={`/products/${item.product.id}`}
              className="font-semibold hover:text-primary"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatPrice(item.product.price)} × {quantity}개
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold">{formatPrice(itemTotal)}</p>
            {isOutOfStock && (
              <p className="text-xs text-destructive">품절</p>
            )}
          </div>
        </div>

        {/* 수량 조절 및 삭제 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={isPending || quantity <= 1}
              aria-label={`${item.product.name} 수량 감소`}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Minus className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
            <span className="w-12 text-center font-medium" aria-label={`수량: ${quantity}개`}>
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={
                isPending ||
                quantity >= item.product.stock_quantity ||
                isOutOfStock
              }
              aria-label={`${item.product.name} 수량 증가`}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={handleRemove}
            disabled={isPending}
            aria-label={`${item.product.name} 장바구니에서 삭제`}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

