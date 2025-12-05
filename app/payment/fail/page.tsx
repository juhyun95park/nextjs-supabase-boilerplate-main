/**
 * @file app/payment/fail/page.tsx
 * @description 결제 실패 페이지
 *
 * Toss Payments 결제 실패 후 리다이렉트되는 페이지입니다.
 * 주문 상태를 취소로 업데이트합니다.
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { cancelPayment } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * 결제 실패 페이지 콘텐츠
 */
function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  const orderId = searchParams.get("orderId");
  const code = searchParams.get("code");
  const message = searchParams.get("message");

  useEffect(() => {
    async function processCancellation() {
      if (!orderId) {
        toast.error("주문 정보가 올바르지 않습니다.");
        router.push("/");
        return;
      }

      try {
        const result = await cancelPayment(orderId);
        if (result.success) {
          toast.info(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error cancelling payment:", error);
        toast.error("주문 취소 처리 중 오류가 발생했습니다.");
      } finally {
        setIsProcessing(false);
      }
    }

    processCancellation();
  }, [orderId, router]);

  if (isProcessing) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">처리 중...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
        <h1 className="mb-4 text-3xl font-bold">결제에 실패했습니다</h1>
        {message && (
          <p className="mb-2 text-muted-foreground">
            <span className="font-semibold">사유:</span> {message}
          </p>
        )}
        {code && (
          <p className="mb-8 text-sm text-muted-foreground">
            에러 코드: {code}
          </p>
        )}
        <p className="mb-8 text-muted-foreground">
          결제가 취소되었습니다. 다시 시도하시거나 다른 결제 수단을 선택해주세요.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/cart">
            <Button variant="outline">장바구니로 돌아가기</Button>
          </Link>
          {orderId && (
            <Link href={`/payment/${orderId}`}>
              <Button>다시 결제하기</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 결제 실패 페이지 (Suspense 래퍼 포함)
 */
export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-muted-foreground" />
          <h1 className="mb-2 text-2xl font-bold">로딩 중...</h1>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}

