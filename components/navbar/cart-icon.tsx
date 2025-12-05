/**
 * @file components/navbar/cart-icon.tsx
 * @description 네비게이션 바 장바구니 아이콘 컴포넌트
 *
 * 장바구니 아이콘과 아이템 개수 배지를 표시하는 Client Component입니다.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getCartItemCount } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 장바구니 아이콘 컴포넌트
 */
export default function CartIcon() {
  const [itemCount, setItemCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCartCount() {
      try {
        const count = await getCartItemCount();
        setItemCount(count);
      } catch (error) {
        // 인증되지 않은 경우 등 에러는 무시
        setItemCount(0);
      } finally {
        setIsLoading(false);
      }
    }

    loadCartCount();

    // 주기적으로 장바구니 개수 업데이트 (5초마다)
    const interval = setInterval(loadCartCount, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {itemCount !== null && itemCount > 0 && (
          <span
            className={cn(
              "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
              itemCount > 99 && "px-1 text-[10px]"
            )}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Link>
    </Button>
  );
}

