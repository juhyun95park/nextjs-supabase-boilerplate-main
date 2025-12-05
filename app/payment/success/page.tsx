/**
 * @file app/payment/success/page.tsx
 * @description 결제 성공 페이지
 *
 * Toss Payments 결제 성공 후 리다이렉트되는 페이지입니다.
 * 결제 확인 및 주문 상태 업데이트를 처리합니다.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { confirmPayment } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * 결제 성공 페이지 콘텐츠
 */
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const amount = searchParams.get("amount");

  useEffect(() => {
    async function processPayment() {
      if (!orderId || !paymentKey || !amount) {
        toast.error("결제 정보가 올바르지 않습니다.");
        router.push("/");
        return;
      }

      try {
        const result = await confirmPayment(
          orderId,
          paymentKey,
          parseInt(amount, 10)
        );

        if (result.success) {
          setIsSuccess(true);
          toast.success(result.message);
        } else {
          toast.error(result.message);
          router.push("/");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        toast.error("결제 처리 중 오류가 발생했습니다.");
        router.push("/");
      } finally {
        setIsProcessing(false);
      }
    }

    processPayment();
  }, [orderId, paymentKey, amount, router]);

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h1 className="mb-2 text-2xl font-bold">결제 처리 중...</h1>
          <p className="text-muted-foreground">
            잠시만 기다려주세요. 결제를 확인하고 있습니다.
          </p>
        </div>
      </div>
    );
  }

  if (!isSuccess) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-4 text-3xl font-bold">결제가 완료되었습니다!</h1>
        <p className="mb-8 text-muted-foreground">
          주문이 정상적으로 처리되었습니다. 주문 내역은 마이페이지에서 확인할 수
          있습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">홈으로 가기</Button>
          </Link>
          {/* TODO: Phase 5에서 주문 상세 페이지 구현 후 활성화 */}
          {/* {orderId && (
            <Link href={`/orders/${orderId}`}>
              <Button>주문 상세 보기</Button>
            </Link>
          )} */}
        </div>
      </div>
    </div>
  );
}

/**
 * 결제 성공 페이지 (Suspense 래퍼 포함)
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
          <h1 className="mb-2 text-2xl font-bold">로딩 중...</h1>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

