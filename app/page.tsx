/**
 * @file app/page.tsx
 * @description 홈페이지
 *
 * legodt.kr 스타일을 참고한 쇼핑몰 홈페이지입니다.
 * 프로모션 배너, 카테고리 섹션, 인기 상품 미리보기를 포함합니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import ProductCard from "@/components/product-card";
import { Product, CATEGORY_NAMES } from "@/types/product";
import { Suspense } from "react";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

/**
 * 인기 상품 목록 조회 (최신 상품 8개)
 */
async function FeaturedProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error || !products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * 카테고리별 색상 매핑
 */
const CATEGORY_COLORS: Record<string, { bg: string; icon: string; hover: string }> = {
  electronics: {
    bg: "from-blue-50/80 via-blue-50/50 to-blue-100/80",
    icon: "bg-blue-100 group-hover:bg-blue-200",
    hover: "from-blue-100/20 to-blue-200/10",
  },
  clothing: {
    bg: "from-pink-50/80 via-pink-50/50 to-pink-100/80",
    icon: "bg-pink-100 group-hover:bg-pink-200",
    hover: "from-pink-100/20 to-pink-200/10",
  },
  books: {
    bg: "from-purple-50/80 via-purple-50/50 to-purple-100/80",
    icon: "bg-purple-100 group-hover:bg-purple-200",
    hover: "from-purple-100/20 to-purple-200/10",
  },
  food: {
    bg: "from-orange-50/80 via-orange-50/50 to-orange-100/80",
    icon: "bg-orange-100 group-hover:bg-orange-200",
    hover: "from-orange-100/20 to-orange-200/10",
  },
  sports: {
    bg: "from-green-50/80 via-green-50/50 to-green-100/80",
    icon: "bg-green-100 group-hover:bg-green-200",
    hover: "from-green-100/20 to-green-200/10",
  },
  beauty: {
    bg: "from-rose-50/80 via-rose-50/50 to-rose-100/80",
    icon: "bg-rose-100 group-hover:bg-rose-200",
    hover: "from-rose-100/20 to-rose-200/10",
  },
  home: {
    bg: "from-amber-50/80 via-amber-50/50 to-amber-100/80",
    icon: "bg-amber-100 group-hover:bg-amber-200",
    hover: "from-amber-100/20 to-amber-200/10",
  },
};

/**
 * 카테고리 섹션 - legodt.kr 스타일 (각 카테고리별 다른 색상)
 */
function CategorySection() {
  const categories = Object.entries(CATEGORY_NAMES).slice(0, 6);

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map(([key, name]) => {
        const colors = CATEGORY_COLORS[key] || {
          bg: "from-primary/5 via-primary/3 to-primary/5",
          icon: "bg-primary/10 group-hover:bg-primary/20",
          hover: "from-primary/10 to-primary/5",
        };

        return (
          <Link
            key={key}
            href={`/products?category=${key}`}
            className="group relative flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-card p-8 text-center transition-all hover:border-primary hover:shadow-lg hover:scale-105"
          >
            {/* 은은한 배경 그라데이션 */}
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br ${colors.bg} opacity-60`}
            />
            
            {/* 아이콘 배경 */}
            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colors.icon} transition-colors`}>
              <ShoppingBag className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            </div>
            
            {/* 카테고리명 */}
            <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
              {name}
            </span>
            
            {/* 호버 시 그라데이션 효과 */}
            <div
              className={`absolute inset-0 -z-10 bg-gradient-to-br ${colors.hover} opacity-0 transition-opacity group-hover:opacity-100`}
            />
          </Link>
        );
      })}
    </div>
  );
}

/**
 * 홈페이지 메인 컴포넌트
 */
export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)]">
      {/* Hero 섹션 - legodt.kr 스타일 */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20 lg:py-32">
        {/* 배경 영상 */}
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-30"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        >
          <source
            src="https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4"
            type="video/mp4"
          />
          {/* 폴백: 영상이 로드되지 않을 경우 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80')",
            }}
          />
        </video>
        {/* 모던한 쇼핑 배경 이미지 + 그라데이션 오버레이 - 텍스트 가독성 향상 */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80')",
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background/85 to-primary/10" aria-hidden="true" />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              <span>새로운 쇼핑 경험을 시작하세요</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight lg:text-7xl">
              최고의 상품을
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                만나보세요
              </span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground lg:text-xl">
              다양한 카테고리의 고품질 상품을 합리적인 가격에 제공합니다
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/products">
                <Button size="lg" className="gap-2 px-8">
                  전체 상품 보기
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products?sort=created_at_desc">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  신상품 보기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 - legodt.kr 스타일 */}
      <section className="border-y bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground">원하는 카테고리를 선택하세요</p>
          </div>
          <CategorySection />
        </div>
      </section>

      {/* 인기 상품 섹션 - legodt.kr "Loved By You" 스타일 */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">인기 상품</h2>
              <p className="text-muted-foreground">지금 가장 인기 있는 상품들을 만나보세요</p>
            </div>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                더보기
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
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
