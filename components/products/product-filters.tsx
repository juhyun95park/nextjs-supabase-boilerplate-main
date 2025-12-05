/**
 * @file components/products/product-filters.tsx
 * @description 상품 목록 필터 컴포넌트
 *
 * 카테고리 필터링을 위한 UI 컴포넌트입니다.
 * URL 쿼리 파라미터를 업데이트하여 필터링 상태를 관리합니다.
 */

"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PRODUCT_CATEGORIES, CATEGORY_NAMES } from "@/types/product";
import { cn } from "@/lib/utils";

/**
 * 상품 필터 컴포넌트
 *
 * 카테고리별 필터링 버튼을 제공합니다.
 */
export default function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";

  // 쿼리 파라미터 업데이트 함수
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      // 필터 변경 시 페이지를 1로 리셋
      params.delete("page");
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryChange = (category: string) => {
    router.push(pathname + "?" + createQueryString("category", category));
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={currentCategory === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryChange("all")}
      >
        전체
      </Button>
      {PRODUCT_CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={currentCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange(category)}
        >
          {CATEGORY_NAMES[category]}
        </Button>
      ))}
    </div>
  );
}

