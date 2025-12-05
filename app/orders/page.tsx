/**
 * @file app/orders/page.tsx
 * @description 주문 내역 목록 페이지
 *
 * 사용자의 주문 내역을 목록으로 표시하는 페이지입니다.
 * Clerk 인증된 사용자만 접근 가능합니다.
 */

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getUserOrders } from "@/actions/order";
import OrderCard from "@/components/orders/order-card";
import EmptyOrders from "@/components/orders/empty-orders";
import { PageLoading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-boundary";

/**
 * 주문 내역 콘텐츠 컴포넌트
 */
async function OrdersContent() {
  const { userId } = await auth();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // 주문 목록 조회
    const orders = await getUserOrders();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">주문 내역</h1>

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading orders:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">주문 내역</h1>
        <ErrorMessage
          message="주문 내역을 불러올 수 없습니다"
          description="주문 내역을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        />
      </div>
    );
  }
}

/**
 * 주문 내역 목록 페이지
 */
export default function OrdersPage() {
  return (
    <Suspense fallback={<PageLoading message="주문 내역을 불러오는 중..." />}>
      <OrdersContent />
    </Suspense>
  );
}

