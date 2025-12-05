/**
 * @file actions/order.ts
 * @description 주문 관련 Server Actions
 *
 * Clerk 인증된 사용자의 주문 생성 및 검증 기능을 제공합니다.
 * Server Actions를 사용하여 Supabase의 orders, order_items 테이블과 연동합니다.
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type {
  ShippingAddress,
  OrderFormData,
  CreateOrderResult,
  OrderDetail,
  Order,
  OrderStatus,
} from "@/types/order";
import { getCartItems } from "./cart";
import { clearCart } from "./cart";
import {
  createOrderInputSchema,
  orderIdSchema,
  orderStatusSchema,
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
 * 주문 전 장바구니를 검증합니다.
 * 재고 확인, 가격 검증, 활성화된 상품 확인을 수행합니다.
 *
 * @returns 검증 결과 및 에러 메시지
 */
export async function validateCartBeforeOrder(): Promise<{
  isValid: boolean;
  message?: string;
  cartItems?: Awaited<ReturnType<typeof getCartItems>>;
}> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템 조회
    const cartItems = await getCartItems();

    if (cartItems.length === 0) {
      return {
        isValid: false,
        message: "장바구니가 비어있습니다.",
      };
    }

    // 각 상품의 재고 및 활성화 상태 확인
    for (const item of cartItems) {
      const { data: product, error } = await supabase
        .from("products")
        .select("id, name, price, stock_quantity, is_active")
        .eq("id", item.product_id)
        .single();

      if (error || !product) {
        return {
          isValid: false,
          message: `상품 "${item.product.name}"을(를) 찾을 수 없습니다.`,
        };
      }

      if (!product.is_active) {
        return {
          isValid: false,
          message: `상품 "${item.product.name}"은(는) 판매 중지되었습니다.`,
        };
      }

      if (product.stock_quantity < item.quantity) {
        return {
          isValid: false,
          message: `상품 "${item.product.name}"의 재고가 부족합니다. (요청: ${item.quantity}개, 재고: ${product.stock_quantity}개)`,
        };
      }

      // 가격 변동 확인 (주문 시점의 가격과 비교)
      if (product.price !== item.product.price) {
        return {
          isValid: false,
          message: `상품 "${item.product.name}"의 가격이 변경되었습니다. 장바구니를 확인해주세요.`,
        };
      }
    }

    return {
      isValid: true,
      cartItems,
    };
  } catch (error) {
    console.error("Error validating cart:", error);
    return {
      isValid: false,
      message:
        error instanceof Error ? error.message : "장바구니 검증 중 오류가 발생했습니다.",
    };
  }
}

/**
 * 주문을 생성합니다.
 * 장바구니 검증 → orders 생성 → order_items 생성 → cart_items 삭제 순서로 진행합니다.
 *
 * @param shippingAddress - 배송 주소
 * @param orderNote - 주문 메모 (선택사항)
 * @returns 생성된 주문 정보
 */
export async function createOrder(
  shippingAddress: ShippingAddress,
  orderNote?: string
): Promise<CreateOrderResult> {
  try {
    // Zod 스키마로 입력값 검증
    const validationResult = createOrderInputSchema.safeParse({
      shippingAddress,
      orderNote,
    });

    if (!validationResult.success) {
      throw new Error(
        validationResult.error.errors[0]?.message || "입력값이 유효하지 않습니다."
      );
    }

    const { shippingAddress: validatedShippingAddress, orderNote: validatedOrderNote } =
      validationResult.data;

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 1. 장바구니 검증
    const validation = await validateCartBeforeOrder();
    if (!validation.isValid || !validation.cartItems) {
      throw new Error(validation.message || "장바구니 검증에 실패했습니다.");
    }

    const cartItems = validation.cartItems;

    // 2. 총 주문 금액 계산
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // 3. 주문 생성 (orders 테이블)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        clerk_id: clerkId,
        total_amount: totalAmount,
        status: "pending",
        shipping_address: validatedShippingAddress,
        order_note: validatedOrderNote || null,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      throw new Error("주문 생성에 실패했습니다.");
    }

    // 4. 주문 상세 아이템 생성 (order_items 테이블)
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
      // 주문은 생성되었지만 아이템 생성 실패 시 주문 삭제
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error("주문 상세 정보 생성에 실패했습니다.");
    }

    // 5. 장바구니 비우기
    await clearCart();

    revalidatePath("/cart");
    revalidatePath("/checkout");

    return {
      orderId: order.id,
      totalAmount: order.total_amount,
      status: order.status as "pending",
    };
  } catch (error) {
    console.error("Error in createOrder:", error);
    throw error instanceof Error
      ? error
      : new Error("주문 생성 중 오류가 발생했습니다.");
  }
}

/**
 * 현재 사용자의 주문 목록을 조회합니다.
 * 최신순으로 정렬하여 반환합니다.
 *
 * @returns 주문 목록
 */
export async function getUserOrders(): Promise<Order[]> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user orders:", error);
      return [];
    }

    return (data || []) as Order[];
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    return [];
  }
}

/**
 * 주문 ID로 주문 상세 정보를 조회합니다.
 *
 * @param orderId - 주문 ID
 * @returns 주문 상세 정보
 */
export async function getOrderById(orderId: string): Promise<OrderDetail | null> {
  try {
    // Zod 스키마로 입력값 검증
    const validationResult = orderIdSchema.safeParse(orderId);

    if (!validationResult.success) {
      console.error("Invalid order ID:", validationResult.error);
      return null;
    }

    const validatedOrderId = validationResult.data;

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 주문 조회 (본인의 주문인지 확인)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", validatedOrderId)
      .eq("clerk_id", clerkId)
      .single();

    if (orderError || !order) {
      return null;
    }

    // 주문 상세 아이템 조회
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", validatedOrderId)
      .order("created_at", { ascending: true });

    if (itemsError) {
      console.error("Error fetching order items:", itemsError);
      return null;
    }

    return {
      ...order,
      items: orderItems || [],
    } as OrderDetail;
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return null;
  }
}

