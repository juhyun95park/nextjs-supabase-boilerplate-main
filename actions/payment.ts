/**
 * @file actions/payment.ts
 * @description 결제 관련 Server Actions
 *
 * Toss Payments 결제 완료 후 주문 상태 업데이트 기능을 제공합니다.
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import {
  confirmPaymentInputSchema,
  cancelPaymentInputSchema,
} from "@/lib/validations/order";

/**
 * 현재 사용자의 Clerk ID를 가져옵니다.
 * 인증되지 않은 경우 에러를 throw합니다.
 */
async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("인증이 필요합니다. 로그인해주세요.");
  }

  return userId;
}

/**
 * 결제 성공 후 주문 상태를 업데이트합니다.
 *
 * @param orderId - 주문 ID
 * @param paymentKey - Toss Payments 결제 키
 * @param amount - 결제 금액
 */
export async function confirmPayment(
  orderId: string,
  paymentKey: string,
  amount: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Zod 스키마로 입력값 검증
    const validationResult = confirmPaymentInputSchema.safeParse({
      orderId,
      paymentKey,
      amount,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors[0]?.message || "입력값이 유효하지 않습니다.",
      };
    }

    const { orderId: validatedOrderId, amount: validatedAmount } =
      validationResult.data;

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 주문 조회 및 본인 확인
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, clerk_id, total_amount, status")
      .eq("id", validatedOrderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      return {
        success: false,
        message: "주문을 찾을 수 없습니다.",
      };
    }

    // 이미 결제 완료된 주문인지 확인
    if (order.status !== "pending") {
      return {
        success: false,
        message: `이미 처리된 주문입니다. (상태: ${order.status})`,
      };
    }

    // 결제 금액 검증
    if (Math.abs(order.total_amount - validatedAmount) > 0.01) {
      return {
        success: false,
        message: "결제 금액이 주문 금액과 일치하지 않습니다.",
      };
    }

    // 주문 상태를 confirmed로 업데이트
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "confirmed" })
      .eq("id", validatedOrderId)
      .eq("clerk_id", clerkId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return {
        success: false,
        message: "주문 상태 업데이트에 실패했습니다.",
      };
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${validatedOrderId}`);

    return {
      success: true,
      message: "결제가 완료되었습니다.",
    };
  } catch (error) {
    console.error("Error in confirmPayment:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "결제 확인 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 결제 실패 시 주문 상태를 취소로 업데이트합니다.
 *
 * @param orderId - 주문 ID
 */
export async function cancelPayment(orderId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Zod 스키마로 입력값 검증
    const validationResult = cancelPaymentInputSchema.safeParse({
      orderId,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors[0]?.message || "입력값이 유효하지 않습니다.",
      };
    }

    const { orderId: validatedOrderId } = validationResult.data;

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 주문 조회 및 본인 확인
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, clerk_id, status")
      .eq("id", validatedOrderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      return {
        success: false,
        message: "주문을 찾을 수 없습니다.",
      };
    }

    // 이미 처리된 주문인지 확인
    if (order.status !== "pending") {
      return {
        success: false,
        message: `이미 처리된 주문입니다. (상태: ${order.status})`,
      };
    }

    // 주문 상태를 cancelled로 업데이트
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", validatedOrderId)
      .eq("clerk_id", clerkId);

    if (updateError) {
      console.error("Error cancelling order:", updateError);
      return {
        success: false,
        message: "주문 취소에 실패했습니다.",
      };
    }

    revalidatePath("/orders");
    revalidatePath(`/orders/${validatedOrderId}`);

    return {
      success: true,
      message: "주문이 취소되었습니다.",
    };
  } catch (error) {
    console.error("Error in cancelPayment:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "주문 취소 중 오류가 발생했습니다.",
    };
  }
}

