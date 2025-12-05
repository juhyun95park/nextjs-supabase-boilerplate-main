/**
 * @file app/robots.ts
 * @description robots.txt 생성
 *
 * Next.js 15 App Router 방식으로 robots.txt를 생성합니다.
 * 검색 엔진 크롤러에게 사이트 크롤링 규칙을 제공합니다.
 */

import { MetadataRoute } from "next";

/**
 * robots.txt 생성
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/checkout/",
          "/payment/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

