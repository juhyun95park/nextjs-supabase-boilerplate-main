/**
 * @file types/product.ts
 * @description 상품 관련 TypeScript 타입 정의
 *
 * Supabase products 테이블 스키마를 기반으로 한 타입 정의입니다.
 */

/**
 * 상품 타입
 *
 * Supabase products 테이블의 구조를 반영합니다.
 */
export interface Product {
  /** 상품 고유 ID (UUID) */
  id: string;
  /** 상품명 */
  name: string;
  /** 상품 설명 */
  description: string | null;
  /** 가격 (DECIMAL) */
  price: number;
  /** 카테고리 */
  category: string | null;
  /** 재고 수량 */
  stock_quantity: number;
  /** 활성화 여부 */
  is_active: boolean;
  /** 생성 일시 */
  created_at: string;
  /** 수정 일시 */
  updated_at: string;
}

/**
 * 상품 목록 조회를 위한 필터 옵션
 */
export interface ProductFilters {
  /** 카테고리 필터 */
  category?: string;
  /** 활성화된 상품만 조회 */
  isActive?: boolean;
  /** 최소 가격 */
  minPrice?: number;
  /** 최대 가격 */
  maxPrice?: number;
}

/**
 * 상품 목록 정렬 옵션
 */
export type ProductSortOption =
  | "created_at_desc" // 최신순 (기본값)
  | "created_at_asc" // 오래된순
  | "price_asc" // 가격 낮은순
  | "price_desc" // 가격 높은순
  | "name_asc"; // 이름 가나다순

/**
 * 상품 카테고리 목록
 *
 * db.sql의 샘플 데이터를 기반으로 한 카테고리 목록
 */
export const PRODUCT_CATEGORIES = [
  "electronics",
  "clothing",
  "books",
  "food",
  "sports",
  "beauty",
  "home",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/**
 * 카테고리 한글명 매핑
 */
export const CATEGORY_NAMES: Record<ProductCategory, string> = {
  electronics: "전자제품",
  clothing: "의류",
  books: "도서",
  food: "식품",
  sports: "스포츠",
  beauty: "뷰티",
  home: "생활용품",
};

