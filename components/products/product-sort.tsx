/**
 * @file components/products/product-sort.tsx
 * @description 상품 목록 정렬 컴포넌트
 *
 * 상품 정렬 옵션을 선택하는 UI 컴포넌트입니다.
 * URL 쿼리 파라미터를 업데이트하여 정렬 상태를 관리합니다.
 */

"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductSortOption } from "@/types/product";

const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: "created_at_desc", label: "최신순" },
  { value: "created_at_asc", label: "오래된순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "name_asc", label: "이름순" },
];

/**
 * 상품 정렬 컴포넌트
 */
export default function ProductSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort =
    (searchParams.get("sort") as ProductSortOption) || "created_at_desc";

  // 쿼리 파라미터 업데이트 함수
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      // 정렬 변경 시 페이지를 1로 리셋
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleSortChange = (value: string) => {
    router.push(pathname + "?" + createQueryString("sort", value));
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium">
        정렬:
      </label>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger id="sort" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

