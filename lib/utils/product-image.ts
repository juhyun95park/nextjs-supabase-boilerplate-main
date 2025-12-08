/**
 * @file lib/utils/product-image.ts
 * @description 상품 이미지 URL 생성 유틸리티
 *
 * 샘플 데이터용으로 Picsum Photos API를 사용합니다.
 * 상품 ID를 기반으로 일관된 이미지를 제공합니다.
 */

import { Product } from "@/types/product";

/**
 * 상품 이미지 URL 생성
 *
 * Picsum Photos를 사용하여 상품 ID 기반으로 일관된 이미지를 제공합니다.
 * 같은 상품은 항상 같은 이미지가 표시됩니다.
 *
 * @param product - 상품 정보
 * @param width - 이미지 너비 (기본값: 400)
 * @param height - 이미지 높이 (기본값: 400)
 * @returns Picsum Photos API URL
 *
 * @example
 * ```tsx
 * const imageUrl = getProductImageUrl(product, 400, 400);
 * <Image src={imageUrl} alt={product.name} fill />
 * ```
 */
export function getProductImageUrl(
  product: Product,
  width: number = 400,
  height: number = 400
): string {
  // 상품 ID를 숫자로 변환하여 시드로 사용
  // UUID의 문자를 숫자로 변환하여 0-999 사이의 값으로 매핑
  const idHash = product.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = idHash % 1000;

  // Picsum Photos API 사용 (seed 기반으로 일관된 이미지 제공)
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

