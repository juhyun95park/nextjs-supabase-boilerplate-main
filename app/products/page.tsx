/**
 * @file app/products/page.tsx
 * @description 상품 목록 페이지
 *
 * Grid 레이아웃으로 상품을 표시하는 페이지입니다.
 * 필터, 정렬, 페이지네이션 기능을 포함합니다.
 * Supabase에서 활성화된 상품들을 조회하여 표시합니다.
 */

import { supabase } from "@/lib/supabase/client";
import ProductCard from "@/components/product-card";
import ProductFilters from "@/components/products/product-filters";
import ProductSort from "@/components/products/product-sort";
import ProductPagination from "@/components/products/product-pagination";
import { Product, ProductSortOption } from "@/types/product";
import { Suspense } from "react";
import { ErrorMessage } from "@/components/ui/error-boundary";
import { EmptyState } from "@/components/ui/empty-state";
import { ProductCardSkeleton } from "@/components/ui/loading";
import { PackageSearch } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

/**
 * 상품 목록을 조회하는 Server Component
 */
async function ProductsList({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const sort = (params.sort as ProductSortOption) || "created_at_desc";
  const page = parseInt(params.page || "1", 10);
  const pageSize = 12;

  // 환경 변수 확인 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error("NEXT_PUBLIC_SUPABASE_URL is not set");
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
    }
  }

  // Supabase 쿼리 빌더 시작
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("is_active", true);

  // 카테고리 필터 적용
  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  // 정렬 적용
  switch (sort) {
    case "created_at_desc":
      query = query.order("created_at", { ascending: false });
      break;
    case "created_at_asc":
      query = query.order("created_at", { ascending: true });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "name_asc":
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // 페이지네이션 적용
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  // 쿼리 실행
  const { data: products, error, count } = await query;

  if (error) {
    // 에러 객체 전체를 직렬화하여 로깅
    const errorInfo = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      // PostgrestError의 경우 추가 속성
      ...(typeof error === "object" && error !== null ? error : {}),
    };

    console.error("Error fetching products:", JSON.stringify(errorInfo, null, 2));
    console.error("Full error object:", error);

    // 테이블이 없는 경우 특별 처리
    const errorMessage = error.message || "";
    const errorCode = error.code || "";
    
    if (
      errorCode === "42P01" ||
      errorMessage.includes("does not exist") ||
      errorMessage.includes("relation") ||
      errorMessage.includes("table")
    ) {
      return (
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            message="products 테이블이 존재하지 않습니다"
            description="Supabase Dashboard에서 마이그레이션을 실행해주세요."
          />
          <div className="mx-auto mt-4 max-w-2xl rounded-lg border bg-muted p-4 text-left">
            <p className="mb-2 text-sm font-medium">해결 방법:</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Supabase Dashboard → SQL Editor로 이동</li>
              <li>
                <code className="rounded bg-background px-1 py-0.5">
                  supabase/migrations/db.sql
                </code>{" "}
                파일의 내용을 복사하여 실행
              </li>
              <li>또는 Supabase CLI로 마이그레이션 실행</li>
            </ol>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage
          message="상품을 불러오는 중 오류가 발생했습니다"
          description={
            error.message || error.code || "알 수 없는 오류가 발생했습니다."
          }
        />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <EmptyState
          icon={<PackageSearch className="h-16 w-16 text-muted-foreground" />}
          title="등록된 상품이 없습니다"
          description="새로운 상품이 등록되면 여기에 표시됩니다."
        />
      </div>
    );
  }

  const totalProducts = count || 0;
  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">전체 상품</h1>
        <p className="mt-2 text-muted-foreground">
          총 {totalProducts}개의 상품이 있습니다
        </p>
      </div>

      {/* 필터 및 정렬 UI */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ProductFilters />
        <ProductSort />
      </div>

      {/* 상품 Grid */}
      {products && products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="mt-8">
              <ProductPagination currentPage={page} totalPages={totalPages} />
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            선택한 조건에 맞는 상품이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * 상품 목록 페이지
 */
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 w-64 animate-pulse rounded bg-muted" />
            <div className="h-10 w-48 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ProductsList searchParams={searchParams} />
    </Suspense>
  );
}

