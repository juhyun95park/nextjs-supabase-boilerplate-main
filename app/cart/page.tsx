/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 사용자의 장바구니 아이템을 표시하고 수량 변경, 삭제 기능을 제공합니다.
 * 리스트 레이아웃으로 장바구니 아이템을 표시합니다.
 */

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getCartItems } from "@/actions/cart";
import CartItem from "@/components/cart/cart-item";
import CartSummary from "@/components/cart/cart-summary";
import EmptyCart from "@/components/cart/empty-cart";
import { calculateCartSummary } from "@/lib/utils/cart";
import { PageLoading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-boundary";

/**
 * 장바구니 콘텐츠 컴포넌트
 */
async function CartContent() {
  const { userId } = await auth();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // 장바구니 아이템 조회
    const cartItems = await getCartItems();

    // 장바구니가 비어있는 경우
    if (cartItems.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-8 text-3xl font-bold">장바구니</h1>
          <EmptyCart />
        </div>
      );
    }

    // 장바구니 요약 정보 계산
    const summary = calculateCartSummary(cartItems);

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">장바구니</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 장바구니 아이템 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* 장바구니 요약 */}
          <div className="lg:col-span-1">
            <CartSummary summary={summary} />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading cart:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">장바구니</h1>
        <ErrorMessage
          message="장바구니를 불러올 수 없습니다"
          description="장바구니 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        />
      </div>
    );
  }
}

/**
 * 장바구니 페이지
 */
export default function CartPage() {
  return (
    <Suspense fallback={<PageLoading message="장바구니를 불러오는 중..." />}>
      <CartContent />
    </Suspense>
  );
}

