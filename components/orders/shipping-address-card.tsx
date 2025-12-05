/**
 * @file components/orders/shipping-address-card.tsx
 * @description 배송 주소 정보 카드 컴포넌트
 *
 * 주문의 배송 주소 정보를 카드 형태로 표시하는 컴포넌트입니다.
 */

import { ShippingAddress } from "@/types/order";
import { formatShippingAddress } from "@/lib/utils/order";
import { MapPin } from "lucide-react";

interface ShippingAddressCardProps {
  address: ShippingAddress;
}

/**
 * 배송 주소 카드 컴포넌트
 */
export default function ShippingAddressCard({
  address,
}: ShippingAddressCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">배송 정보</h2>
      </div>
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">수령인:</span> {address.recipientName}
        </div>
        <div>
          <span className="font-medium">전화번호:</span> {address.phone}
        </div>
        <div>
          <span className="font-medium">주소:</span>{" "}
          {formatShippingAddress(address)}
        </div>
      </div>
    </div>
  );
}

