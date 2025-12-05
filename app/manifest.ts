/**
 * @file app/manifest.ts
 * @description PWA 매니페스트 생성
 *
 * Next.js 15 App Router 방식으로 웹 앱 매니페스트를 생성합니다.
 * PWA(Progressive Web App) 기능을 제공합니다.
 */

import { MetadataRoute } from "next";

/**
 * 웹 앱 매니페스트 생성
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SaaS 템플릿",
    short_name: "SaaS 템플릿",
    description: "Next.js 15 + Clerk + Supabase 기반 쇼핑몰 애플리케이션",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    orientation: "portrait",
    categories: ["shopping", "ecommerce"],
    lang: "ko",
    dir: "ltr",
  };
}

