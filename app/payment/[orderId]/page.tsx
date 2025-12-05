/**
 * @file app/payment/[orderId]/page.tsx
 * @description 결제 페이지
 *
 * Toss Payments 결제 위젯을 표시하고 결제를 처리하는 페이지입니다.
 */

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getOrderById } from "@/actions/order";
import TossPaymentWidget from "@/components/payment/toss-payment-widget";
import { OrderDetail } from "@/types/order";
import { PageLoading } from "@/components/ui/loading";
import { ErrorMessage } from "@/components/ui/error-boundary";
import { toast } from "sonner";
import {
  PaymentWidgetInstance,
  ANONYMOUS,
} from "@tosspayments/payment-widget-sdk";

/**
 * 결제 페이지
 */
export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { userId, isSignedIn, isLoaded } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = params.orderId as string;

  // Toss Payments 클라이언트 키 (환경 변수에서 가져오기)
  const clientKey = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || "";

  useEffect(() => {
    async function loadOrder() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }

      if (!clientKey) {
        toast.error("결제 서비스 설정이 완료되지 않았습니다.");
        router.push("/");
        return;
      }

      try {
        const orderData = await getOrderById(orderId);
        if (!orderData) {
          toast.error("주문을 찾을 수 없습니다.");
          router.push("/");
          return;
        }

        // 주문 상태 확인
        if (orderData.status !== "pending") {
          toast.error(
            `이미 처리된 주문입니다. (상태: ${
              orderData.status === "confirmed"
                ? "결제 완료"
                : orderData.status === "cancelled"
                  ? "취소됨"
                  : orderData.status
            })`
          );
          router.push("/");
          return;
        }

        setOrder(orderData);
      } catch (error) {
        console.error("Error loading order:", error);
        toast.error("주문 정보를 불러오는데 실패했습니다.");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [orderId, isSignedIn, isLoaded, router, clientKey]);

  const handleRequestPayment = async (
    paymentWidget: PaymentWidgetInstance
  ) => {
    if (!order || !userId) return;

    try {
      // 주문명 생성 (첫 번째 상품명 + 외 N건)
      const firstProductName = order.items[0]?.product_name || "상품";
      const otherCount = order.items.length - 1;
      const orderName =
        otherCount > 0
          ? `${firstProductName} 외 ${otherCount}건`
          : firstProductName;

      // 배송 주소에서 고객 정보 추출
      const shippingAddress = order.shipping_address;
      if (!shippingAddress) {
        toast.error("배송 주소 정보가 없습니다.");
        return;
      }

      // 결제 요청
      await paymentWidget.requestPayment({
        orderId: order.id,
        orderName,
        successUrl: `${window.location.origin}/payment/success?orderId=${order.id}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${order.id}`,
        customerEmail: userId + "@example.com", // TODO: 실제 이메일 사용
        customerName: shippingAddress.recipientName,
        customerMobilePhone: shippingAddress.phone,
      });
    } catch (error) {
      console.error("Error requesting payment:", error);
      toast.error("결제 요청에 실패했습니다.");
    }
  };

  if (!isLoaded || isLoading) {
    return <PageLoading message="주문 정보를 불러오는 중..." />;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16">
        <ErrorMessage
          message="주문 정보를 찾을 수 없습니다"
          description="유효하지 않은 주문이거나 접근 권한이 없습니다."
        />
      </div>
    );
  }

  // 고객 키 생성 (Clerk user ID 사용)
  const customerKey = userId || ANONYMOUS;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">결제하기</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 결제 위젯 */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-6 text-xl font-semibold">결제 수단 선택</h2>
            <TossPaymentWidget
              clientKey={clientKey}
              customerKey={customerKey}
              amount={order.total_amount}
              orderName={
                order.items.length > 1
                  ? `${order.items[0].product_name} 외 ${order.items.length - 1}건`
                  : order.items[0]?.product_name || "상품"
              }
              onRequestPayment={handleRequestPayment}
            />
          </div>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">주문 요약</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString("ko-KR")}원
                  </span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>총 결제금액</span>
                  <span>{order.total_amount.toLocaleString("ko-KR")}원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

