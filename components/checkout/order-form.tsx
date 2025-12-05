/**
 * @file components/checkout/order-form.tsx
 * @description 주문 폼 컴포넌트
 *
 * 주문 정보 입력 폼입니다. 주소 입력 필드와 주문 메모를 포함합니다.
 * react-hook-form과 Zod를 사용하여 유효성 검사를 수행합니다.
 */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShippingAddress } from "@/types/order";
import { Loader2 } from "lucide-react";
import { orderFormSchema, type OrderFormInput } from "@/lib/validations/order";

type AddressFormData = OrderFormInput;

interface OrderFormProps {
  onSubmit: (data: {
    shippingAddress: ShippingAddress;
    orderNote?: string;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

/**
 * 주문 폼 컴포넌트
 */
export default function OrderForm({
  onSubmit,
  isSubmitting = false,
}: OrderFormProps) {
  const form = useForm<AddressFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      shippingAddress: {
        recipientName: "",
        phone: "",
        postalCode: "",
        address: "",
        detailAddress: "",
      },
      orderNote: undefined,
    },
  });

  const handleSubmit = async (data: AddressFormData) => {
    // Zod 검증을 통과한 데이터이므로 타입이 보장됨
    await onSubmit({
      shippingAddress: data.shippingAddress as ShippingAddress,
      orderNote: data.orderNote,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">배송 정보</h3>

          <FormField
            control={form.control}
            name="shippingAddress.recipientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>수령인 이름 *</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingAddress.phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>전화번호 *</FormLabel>
                <FormControl>
                  <Input placeholder="010-1234-5678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingAddress.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>우편번호 *</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingAddress.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>주소 *</FormLabel>
                <FormControl>
                  <Input placeholder="서울시 강남구 테헤란로 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shippingAddress.detailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>상세 주소 *</FormLabel>
                <FormControl>
                  <Input placeholder="123동 456호" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">주문 메모 (선택사항)</h3>

          <FormField
            control={form.control}
            name="orderNote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>배송 시 요청사항</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="배송 시 요청사항을 입력해주세요."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              주문 처리 중...
            </>
          ) : (
            "주문하기"
          )}
        </Button>
      </form>
    </Form>
  );
}

