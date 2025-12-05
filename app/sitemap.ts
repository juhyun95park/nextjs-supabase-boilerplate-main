/**
 * @file app/sitemap.ts
 * @description sitemap.xml 생성
 *
 * Next.js 15 App Router 방식으로 sitemap.xml을 생성합니다.
 * 검색 엔진에 사이트 구조를 제공합니다.
 */

import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase/client";

/**
 * sitemap.xml 생성
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const baseUrl = siteUrl.replace(/\/$/, "");

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  // 동적 페이지: 상품 상세 페이지
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const { data: products } = await supabase
      .from("products")
      .select("id, updated_at")
      .eq("is_active", true);

    if (products && products.length > 0) {
      productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: product.updated_at
          ? new Date(product.updated_at)
          : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {
    // 에러 발생 시 빈 배열 반환 (정적 페이지만 포함)
    // 에러 로깅은 프로덕션에서만 필요시 활성화
  }

  return [...staticPages, ...productPages];
}

