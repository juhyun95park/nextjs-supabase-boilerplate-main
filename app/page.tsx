/**
 * @file app/page.tsx
 * @description 홈페이지
 *
 * 쇼핑몰 홈페이지로, 프로모션 배너, 카테고리 섹션, 인기 상품 미리보기를 포함합니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import ProductCard from "@/components/product-card";
import { Product, CATEGORY_NAMES } from "@/types/product";
import { Suspense } from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";

/**
 * 인기 상품 목록 조회 (최신 상품 6개)
 */
async function FeaturedProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error || !products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * 카테고리 섹션
 */
function CategorySection() {
  const categories = Object.entries(CATEGORY_NAMES).slice(0, 6);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map(([key, name]) => (
        <Link
          key={key}
          href={`/products?category=${key}`}
          className="group flex flex-col items-center justify-center rounded-lg border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-md"
        >
          <ShoppingBag className="mb-2 h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
          <span className="font-medium">{name}</span>
        </Link>
      ))}
    </div>
  );
}

/**
 * 홈페이지 메인 컴포넌트
 */
export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* Hero 섹션 */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold leading-tight lg:text-6xl">
              최고의 상품을 만나보세요
            </h1>
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              다양한 카테고리의 고품질 상품을 합리적인 가격에 제공합니다
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                전체 상품 보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-2xl font-bold">카테고리</h2>
          <CategorySection />
        </div>
      </section>

      {/* 인기 상품 섹션 */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">인기 상품</h2>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                더보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-lg border bg-muted"
                  />
                ))}
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
