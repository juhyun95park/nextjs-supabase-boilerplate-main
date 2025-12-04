/**
 * @file app/layout.tsx
 * @description Root Layout with Clerk Korean Localization
 *
 * 이 파일은 Next.js App Router의 루트 레이아웃입니다.
 * Clerk 인증 제공자와 한국어 로컬라이제이션을 설정합니다.
 *
 * 주요 기능:
 * 1. ClerkProvider로 전역 인증 컨텍스트 제공
 * 2. 한국어 로컬라이제이션 적용 (koKR)
 * 3. Tailwind CSS 4 호환성 설정
 * 4. 사용자 동기화 프로바이더 설정
 *
 * @see {@link https://clerk.com/docs/guides/customizing-clerk/localization} - Clerk 로컬라이제이션 가이드
 */

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        // Tailwind CSS 4 호환성을 위한 설정
        cssLayerName: "clerk",
      }}
    >
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
