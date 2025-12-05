/**
 * @file actions/cart.ts
 * @description 장바구니 관련 Server Actions
 *
 * Clerk 인증된 사용자의 장바구니 CRUD 기능을 제공합니다.
 * Server Actions를 사용하여 Supabase의 cart_items 테이블과 연동합니다.
 */

"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type {
  CartItem,
  AddToCartInput,
  UpdateCartQuantityInput,
} from "@/types/cart";
import {
  addToCartInputSchema,
  updateCartQuantityInputSchema,
  removeFromCartInputSchema,
} from "@/lib/validations/cart";

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
 * 장바구니에 상품을 추가합니다.
 * 이미 장바구니에 있는 상품이면 수량을 증가시킵니다.
 *
 * @param productId - 추가할 상품 ID
 * @param quantity - 추가할 수량 (기본값: 1)
 */
export async function addToCart(
  productId: string,
  quantity: number = 1
): Promise<{ success: boolean; message: string }> {
  try {
    // Zod 스키마로 입력값 검증
    const validationResult = addToCartInputSchema.safeParse({
      productId,
      quantity,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors[0]?.message || "입력값이 유효하지 않습니다.",
      };
    }

    const { productId: validatedProductId, quantity: validatedQuantity } =
      validationResult.data;

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 상품 존재 및 활성화 여부 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, name, price, stock_quantity, is_active")
      .eq("id", validatedProductId)
      .single();

    if (productError || !product) {
      return {
        success: false,
        message: "상품을 찾을 수 없습니다.",
      };
    }

    if (!product.is_active) {
      return {
        success: false,
        message: "판매 중지된 상품입니다.",
      };
    }

    // 기존 장바구니 아이템 확인
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("clerk_id", clerkId)
      .eq("product_id", validatedProductId)
      .single();

    if (existingItem) {
      // 기존 아이템이 있으면 수량 증가
      const newQuantity = existingItem.quantity + validatedQuantity;

      // 재고 확인
      if (newQuantity > product.stock_quantity) {
        return {
          success: false,
          message: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
        };
      }

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        return {
          success: false,
          message: "장바구니 업데이트에 실패했습니다.",
        };
      }
    } else {
      // 새 아이템 추가
      // 재고 확인
      if (validatedQuantity > product.stock_quantity) {
        return {
          success: false,
          message: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
        };
      }

      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          clerk_id: clerkId,
          product_id: validatedProductId,
          quantity: validatedQuantity,
        });

      if (insertError) {
        console.error("Error adding to cart:", insertError);
        return {
          success: false,
          message: "장바구니에 추가하는데 실패했습니다.",
        };
      }
    }

    revalidatePath("/cart");
    return {
      success: true,
      message: "장바구니에 추가되었습니다.",
    };
  } catch (error) {
    console.error("Error in addToCart:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니에서 상품을 삭제합니다.
 *
 * @param cartItemId - 삭제할 장바구니 아이템 ID
 */
export async function removeFromCart(
  cartItemId: string
): Promise<{ success: boolean; message: string }> {
  try {
    // Zod 스키마로 입력값 검증
    const validationResult = removeFromCartInputSchema.safeParse({
      cartItemId,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors[0]?.message || "입력값이 유효하지 않습니다.",
      };
    }

    const { cartItemId: validatedCartItemId } = validationResult.data;

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 본인의 장바구니 아이템인지 확인
    const { data: cartItem, error: checkError } = await supabase
      .from("cart_items")
      .select("id")
      .eq("id", validatedCartItemId)
      .eq("clerk_id", clerkId)
      .single();

    if (checkError || !cartItem) {
      return {
        success: false,
        message: "장바구니 아이템을 찾을 수 없습니다.",
      };
    }

    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", validatedCartItemId)
      .eq("clerk_id", clerkId);

    if (deleteError) {
      console.error("Error removing from cart:", deleteError);
      return {
        success: false,
        message: "장바구니에서 삭제하는데 실패했습니다.",
      };
    }

    revalidatePath("/cart");
    return {
      success: true,
      message: "장바구니에서 삭제되었습니다.",
    };
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 장바구니 아이템의 수량을 변경합니다.
 *
 * @param cartItemId - 수량을 변경할 장바구니 아이템 ID
 * @param quantity - 변경할 수량
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; message: string }> {
  try {
    // Zod 스키마로 입력값 검증
    const validationResult = updateCartQuantityInputSchema.safeParse({
      cartItemId,
      quantity,
    });

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors[0]?.message || "입력값이 유효하지 않습니다.",
      };
    }

    const { cartItemId: validatedCartItemId, quantity: validatedQuantity } =
      validationResult.data;

    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    // 장바구니 아이템과 상품 정보 조회
    const { data: cartItem, error: cartError } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity")
      .eq("id", validatedCartItemId)
      .eq("clerk_id", clerkId)
      .single();

    if (cartError || !cartItem) {
      return {
        success: false,
        message: "장바구니 아이템을 찾을 수 없습니다.",
      };
    }

    // 상품 재고 확인
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("stock_quantity, is_active")
      .eq("id", cartItem.product_id)
      .single();

    if (productError || !product) {
      return {
        success: false,
        message: "상품을 찾을 수 없습니다.",
      };
    }

    if (!product.is_active) {
      return {
        success: false,
        message: "판매 중지된 상품입니다.",
      };
    }

    if (validatedQuantity > product.stock_quantity) {
      return {
        success: false,
        message: `재고가 부족합니다. (현재 재고: ${product.stock_quantity}개)`,
      };
    }

    // 수량 업데이트
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ quantity: validatedQuantity })
      .eq("id", validatedCartItemId)
      .eq("clerk_id", clerkId);

    if (updateError) {
      console.error("Error updating cart quantity:", updateError);
      return {
        success: false,
        message: "수량 변경에 실패했습니다.",
      };
    }

    revalidatePath("/cart");
    return {
      success: true,
      message: "수량이 변경되었습니다.",
    };
  } catch (error) {
    console.error("Error in updateCartItemQuantity:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

/**
 * 현재 사용자의 장바구니 아이템을 조회합니다.
 * products 테이블과 조인하여 상품 정보를 함께 반환합니다.
 *
 * @returns 장바구니 아이템 목록
 */
export async function getCartItems(): Promise<CartItem[]> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { data, error } = await supabase
      .from("cart_items")
      .select(
        `
        id,
        clerk_id,
        product_id,
        quantity,
        created_at,
        updated_at,
        products(*)
      `
      )
      .eq("clerk_id", clerkId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      clerk_id: item.clerk_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      updated_at: item.updated_at,
      product: Array.isArray(item.products) ? item.products[0] : item.products,
    })) as CartItem[];
  } catch (error) {
    console.error("Error in getCartItems:", error);
    return [];
  }
}

/**
 * 장바구니의 총 아이템 개수를 조회합니다.
 * 네비게이션 바의 배지 표시에 사용됩니다.
 *
 * @returns 총 아이템 개수
 */
export async function getCartItemCount(): Promise<number> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error fetching cart count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * 장바구니를 전체 비웁니다.
 */
export async function clearCart(): Promise<{ success: boolean; message: string }> {
  try {
    const clerkId = await getCurrentUserId();
    const supabase = createClerkSupabaseClient();

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("clerk_id", clerkId);

    if (error) {
      console.error("Error clearing cart:", error);
      return {
        success: false,
        message: "장바구니를 비우는데 실패했습니다.",
      };
    }

    revalidatePath("/cart");
    return {
      success: true,
      message: "장바구니가 비워졌습니다.",
    };
  } catch (error) {
    console.error("Error in clearCart:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
    };
  }
}

