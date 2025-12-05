/**
 * @file components/payment/toss-payment-widget.tsx
 * @description Toss Payments 결제 위젯 컴포넌트
 *
 * Toss Payments 위젯을 렌더링하고 결제 요청을 처리하는 컴포넌트입니다.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  PaymentWidgetInstance,
  loadPaymentWidget,
  ANONYMOUS,
} from "@tosspayments/payment-widget-sdk";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { PaymentRequestParams } from "@/types/payment";

interface TossPaymentWidgetProps {
  clientKey: string;
  customerKey: string;
  amount: number;
  orderName: string;
  onRequestPayment: (
    paymentWidget: PaymentWidgetInstance
  ) => Promise<void>;
}

/**
 * Toss Payments 결제 위젯 컴포넌트
 */
export default function TossPaymentWidget({
  clientKey,
  customerKey,
  amount,
  orderName,
  onRequestPayment,
}: TossPaymentWidgetProps) {
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<
    PaymentWidgetInstance["renderPaymentMethods"]
  > | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Toss Payments 위젯 로드
        const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

        // 결제 수단 UI 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-method",
          { value: amount },
          { variantKey: "DEFAULT" }
        );

        // 약관 동의 UI 렌더링
        paymentWidget.renderAgreement("#agreement", {
          variantKey: "AGREEMENT",
        });

        paymentWidgetRef.current = paymentWidget;
        paymentMethodsWidgetRef.current = paymentMethodsWidget;
        setIsReady(true);
      } catch (error) {
        console.error("Error loading payment widget:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [clientKey, customerKey, amount]);

  // 결제 금액이 변경되면 위젯 업데이트
  useEffect(() => {
    const paymentMethodsWidget = paymentMethodsWidgetRef.current;

    if (paymentMethodsWidget == null || !isReady) {
      return;
    }

    paymentMethodsWidget.updateAmount(amount);
  }, [amount, isReady]);

  const handlePayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    if (!paymentWidget || !isReady) {
      return;
    }

    await onRequestPayment(paymentWidget);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 결제 수단 UI */}
      <div id="payment-method" />

      {/* 약관 동의 UI */}
      <div id="agreement" />

      {/* 결제하기 버튼 */}
      <Button
        size="lg"
        className="w-full"
        onClick={handlePayment}
        disabled={!isReady}
      >
        {isReady ? `${amount.toLocaleString("ko-KR")}원 결제하기` : "로딩 중..."}
      </Button>
    </div>
  );
}

