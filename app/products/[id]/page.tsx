/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 개별 상품의 상세 정보를 표시하는 페이지입니다.
 * 상품 ID를 기반으로 Supabase에서 상품 정보를 조회합니다.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Product, CATEGORY_NAMES } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 상품 상세 페이지
 */
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  // Supabase에서 상품 조회
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  // 상품이 없거나 에러 발생 시 404
  if (error || !product) {
    notFound();
  }

  // 비활성화된 상품 처리
  if (!product.is_active) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-4 text-2xl font-bold">판매 중지된 상품입니다</h1>
          <p className="mb-8 text-muted-foreground">
            이 상품은 현재 판매 중지되었습니다.
          </p>
          <Link href="/products">
            <Button>상품 목록으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedPrice = product.price.toLocaleString("ko-KR");
  const categoryName =
    product.category && product.category in CATEGORY_NAMES
      ? CATEGORY_NAMES[product.category as keyof typeof CATEGORY_NAMES]
      : product.category;

  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">홈</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/products">상품 목록</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* 뒤로가기 버튼 */}
      <Link href="/products" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        상품 목록으로
      </Link>

      {/* 상품 정보 */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 상품 이미지 */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
          {/* TODO: 실제 상품 이미지 URL이 추가되면 Image 컴포넌트로 교체 */}
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-6xl font-bold text-primary/30">
              {product.name.charAt(0)}
            </span>
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-full bg-destructive px-6 py-3 text-lg font-semibold text-destructive-foreground">
                품절
              </span>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex flex-col">
          {/* 카테고리 */}
          {categoryName && (
            <span className="mb-4 inline-block w-fit rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              {categoryName}
            </span>
          )}

          {/* 상품명 */}
          <h1 className="mb-4 text-3xl font-bold lg:text-4xl">
            {product.name}
          </h1>

          {/* 가격 */}
          <div className="mb-6">
            <span className="text-4xl font-bold">{formattedPrice}원</span>
          </div>

          {/* 재고 정보 */}
          <div className="mb-6 space-y-2">
            {isOutOfStock ? (
              <p className="text-lg font-semibold text-destructive">품절</p>
            ) : (
              <p className="text-muted-foreground">
                재고: <span className="font-semibold text-foreground">{product.stock_quantity}개</span>
              </p>
            )}
          </div>

          {/* 상품 설명 */}
          {product.description && (
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold">상품 설명</h2>
              <p className="whitespace-pre-line text-muted-foreground">
                {product.description}
              </p>
            </div>
          )}

          {/* 장바구니 담기 버튼 */}
          <div className="mt-auto space-y-4">
            <Button
              size="lg"
              className="w-full gap-2"
              disabled={isOutOfStock}
            >
              <ShoppingCart className="h-5 w-5" />
              {isOutOfStock ? "품절" : "장바구니에 담기"}
            </Button>
            <p className="text-xs text-muted-foreground">
              * 장바구니 기능은 Phase 3에서 구현 예정입니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

