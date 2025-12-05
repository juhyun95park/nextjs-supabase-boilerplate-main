/**
 * @file app/orders/[orderId]/page.tsx
 * @description 주문 상세 페이지
 *
 * 개별 주문의 상세 정보를 표시하는 페이지입니다.
 * 주문 정보, 배송 주소, 주문 상품 목록을 포함합니다.
 */

import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getOrderById } from "@/actions/order";
import OrderDetailHeader from "@/components/orders/order-detail-header";
import OrderItemsList from "@/components/orders/order-items-list";
import ShippingAddressCard from "@/components/orders/shipping-address-card";
import { formatPrice } from "@/lib/utils/cart";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PageLoading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-boundary";

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

/**
 * 주문 상세 콘텐츠 컴포넌트
 */
async function OrderDetailContent({ orderId }: { orderId: string }) {
  const { userId } = await auth();

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    // 주문 상세 정보 조회
    const order = await getOrderById(orderId);

    // 주문이 없거나 본인의 주문이 아닌 경우 404
    if (!order) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">홈</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/orders">주문 내역</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>주문 상세</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 뒤로가기 버튼 */}
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          주문 내역으로
        </Link>

        {/* 주문 헤더 */}
        <OrderDetailHeader order={order} />

        <div className="grid gap-8 lg:grid-cols-3">
          {/* 주문 상품 목록 */}
          <div className="lg:col-span-2">
            <OrderItemsList items={order.items} />
          </div>

          {/* 사이드바: 배송 정보 및 주문 요약 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 배송 주소 */}
            {order.shipping_address && (
              <ShippingAddressCard address={order.shipping_address} />
            )}

            {/* 주문 요약 */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">주문 요약</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span className="font-medium">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">배송비</span>
                  <span className="font-medium">무료</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>총 결제금액</span>
                    <span>{formatPrice(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 주문 메모 */}
            {order.order_note && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-2 text-lg font-semibold">주문 메모</h2>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {order.order_note}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading order detail:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message="주문 정보를 불러올 수 없습니다"
          description="주문 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
        />
      </div>
    );
  }
}

/**
 * 주문 상세 페이지
 */
export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;

  return (
    <Suspense fallback={<PageLoading message="주문 정보를 불러오는 중..." />}>
      <OrderDetailContent orderId={orderId} />
    </Suspense>
  );
}

