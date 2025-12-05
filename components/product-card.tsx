/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * Grid 레이아웃에서 사용할 상품 카드 컴포넌트입니다.
 * 상품 정보를 카드 형태로 표시하고, 클릭 시 상품 상세 페이지로 이동합니다.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Product, CATEGORY_NAMES } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드 컴포넌트
 *
 * @param product - 표시할 상품 정보
 */
export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = product.price.toLocaleString("ko-KR");
  const categoryName =
    product.category && product.category in CATEGORY_NAMES
      ? CATEGORY_NAMES[product.category as keyof typeof CATEGORY_NAMES]
      : product.category;

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className={cn(
        "group relative flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.02]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isOutOfStock && "opacity-60"
      )}
      aria-label={`${product.name} 상품 상세 보기`}
    >
      {/* 상품 이미지 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
        {/* TODO: 실제 상품 이미지 URL이 추가되면 Image 컴포넌트로 교체 */}
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
          <span className="text-4xl font-bold text-primary/30">
            {product.name.charAt(0)}
          </span>
        </div>
        {/* 재고 없음 배지 */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/50"
            role="status"
            aria-label="품절"
          >
            <span className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground">
              품절
            </span>
          </div>
        )}
      </div>

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col p-4">
        {/* 카테고리 태그 */}
        {categoryName && (
          <span className="mb-2 inline-block w-fit rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {categoryName}
          </span>
        )}

        {/* 상품명 */}
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight group-hover:text-primary">
          {product.name}
        </h3>

        {/* 상품 설명 (선택사항) */}
        {product.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {product.description}
          </p>
        )}

        {/* 가격 및 재고 정보 */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {formattedPrice}원
            </span>
            {product.stock_quantity > 0 && (
              <span className="text-xs text-muted-foreground">
                재고 {product.stock_quantity}개
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

