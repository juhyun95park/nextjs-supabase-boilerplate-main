/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * Grid 레이아웃에서 사용할 상품 카드 컴포넌트입니다.
 * 상품 정보를 카드 형태로 표시하고, 클릭 시 상품 상세 페이지로 이동합니다.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, CATEGORY_NAMES } from "@/types/product";
import { cn } from "@/lib/utils";
import { getProductImageUrl } from "@/lib/utils/product-image";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

/**
 * 상품 카드 컴포넌트
 *
 * @param product - 표시할 상품 정보
 */
export default function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const formattedPrice = product.price.toLocaleString("ko-KR");
  // 소비자가 (할인 전 가격) - legodt.kr 스타일
  const originalPrice = Math.round(product.price * 1.2);
  const formattedOriginalPrice = originalPrice.toLocaleString("ko-KR");
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  
  const categoryName =
    product.category && product.category in CATEGORY_NAMES
      ? CATEGORY_NAMES[product.category as keyof typeof CATEGORY_NAMES]
      : product.category;

  const isOutOfStock = product.stock_quantity === 0;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200",
        "hover:shadow-lg hover:scale-[1.02]",
        isOutOfStock && "opacity-60"
      )}
    >
      {/* 상품 이미지 */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full overflow-hidden rounded-t-lg bg-muted"
        aria-label={`${product.name} 상품 상세 보기`}
      >
        <Image
          src={getProductImageUrl(product, 400, 400)}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* 좋아요 버튼 - legodt.kr 스타일 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handleLike}
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isLiked
                ? "fill-destructive text-destructive"
                : "text-muted-foreground hover:text-destructive"
            )}
          />
        </Button>

        {/* 재고 없음 배지 - legodt.kr "SOLD OUT" 스타일 */}
        {isOutOfStock && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/60"
            role="status"
            aria-label="품절"
          >
            <span className="rounded-md bg-destructive px-6 py-2 text-sm font-bold text-destructive-foreground">
              SOLD OUT
            </span>
          </div>
        )}
      </Link>

      {/* 상품 정보 */}
      <div className="flex flex-1 flex-col p-4">
        {/* 상품명 */}
        <Link
          href={`/products/${product.id}`}
          className="mb-2 line-clamp-2 font-semibold leading-tight transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        {/* 가격 정보 - legodt.kr 스타일 (판매가/소비자가) */}
        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              {formattedPrice}원
            </span>
            <span className="text-sm text-muted-foreground line-through">
              {formattedOriginalPrice}원
            </span>
            <span className="text-xs font-semibold text-destructive">
              {discountPercent}%
            </span>
          </div>
          {product.stock_quantity > 0 && (
            <span className="text-xs text-muted-foreground">
              재고 {product.stock_quantity}개
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

