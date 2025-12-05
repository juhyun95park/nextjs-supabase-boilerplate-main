/**
 * @file app/checkout/page.tsx
 * @description 주문 페이지
 *
 * 주문 정보 입력 페이지입니다. 배송 주소와 주문 메모를 입력하고 주문을 생성합니다.
 */

"use client";

import { useEffect, useState, useTransition } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getCartItems } from "@/actions/cart";
import { createOrder, validateCartBeforeOrder } from "@/actions/order";
import OrderForm from "@/components/checkout/order-form";
import OrderSummary from "@/components/checkout/order-summary";
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/order";
import { toast } from "sonner";
import { PageLoading } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";

/**
 * 주문 페이지
 */
export default function CheckoutPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startTransition] = useTransition();

  useEffect(() => {
    async function loadCart() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        redirect("/sign-in");
        return;
      }

      try {
        // 장바구니 검증 및 조회
        const validation = await validateCartBeforeOrder();
        if (!validation.isValid || !validation.cartItems) {
          toast.error(validation.message || "장바구니 검증에 실패했습니다.");
          redirect("/cart");
          return;
        }

        setCartItems(validation.cartItems);
      } catch (error) {
        console.error("Error loading cart:", error);
        toast.error("장바구니를 불러오는데 실패했습니다.");
        redirect("/cart");
      } finally {
        setIsLoading(false);
      }
    }

    loadCart();
  }, [isSignedIn, isLoaded]);

  const handleSubmit = async (data: {
    shippingAddress: ShippingAddress;
    orderNote?: string;
  }) => {
    startTransition(async () => {
      try {
        const result = await createOrder(data.shippingAddress, data.orderNote);
        toast.success("주문이 생성되었습니다. 결제를 진행해주세요.");
        // 결제 페이지로 리다이렉트
        redirect(`/payment/${result.orderId}`);
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error(
          error instanceof Error ? error.message : "주문 생성에 실패했습니다."
        );
      }
    });
  };

  if (!isLoaded || isLoading) {
    return <PageLoading message="장바구니를 불러오는 중..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<ShoppingBag className="h-16 w-16 text-muted-foreground" />}
          title="장바구니가 비어있습니다"
          description="주문할 상품이 없습니다. 장바구니에 상품을 담아주세요."
          actionLabel="상품 보러가기"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">주문하기</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 주문 폼 */}
        <div className="lg:col-span-2">
          <OrderForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <OrderSummary cartItems={cartItems} />
        </div>
      </div>
    </div>
  );
}

