/**
 * @file client.ts
 * @description Supabase 공개 데이터용 클라이언트 (인증 불필요)
 *
 * 이 파일은 인증이 필요 없는 공개 데이터에 접근하기 위한 Supabase 클라이언트를 제공합니다.
 * 
 * 주요 특징:
 * 1. RLS 정책이 `to anon`인 데이터만 접근 가능
 * 2. Clerk 인증 없이 사용 가능
 * 3. 공개 API, 블로그 포스트, 상품 목록 등에 사용
 *
 * @see {@link https://supabase.com/docs/guides/getting-started/quickstarts/nextjs} - Supabase Next.js 공식 가이드
 * @see {@link ./server.ts} - 인증이 필요한 경우 Server Component용 클라이언트 사용
 * @see {@link ./clerk-client.ts} - 인증이 필요한 경우 Client Component용 클라이언트 사용
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

/**
 * 공개 데이터용 Supabase 클라이언트
 * 
 * 인증이 필요 없는 공개 데이터에 접근할 때 사용합니다.
 * RLS 정책이 `to anon`인 데이터만 조회 가능합니다.
 *
 * @example
 * ```tsx
 * // Server Component에서 공개 데이터 조회
 * import { supabase } from '@/lib/supabase/client';
 *
 * export default async function PublicPage() {
 *   const { data } = await supabase
 *     .from('public_posts')
 *     .select('*')
 *     .eq('published', true);
 *
 *   return <div>{/* 렌더링 */}</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Client Component에서 공개 데이터 조회
 * 'use client';
 *
 * import { supabase } from '@/lib/supabase/client';
 * import { useEffect, useState } from 'react';
 *
 * export default function PublicList() {
 *   const [data, setData] = useState([]);
 *
 *   useEffect(() => {
 *     async function fetchData() {
 *       const { data } = await supabase
 *         .from('public_products')
 *         .select('*');
 *       setData(data || []);
 *     }
 *     fetchData();
 *   }, []);
 *
 *   return <div>{/* 렌더링 */}</div>;
 * }
 * ```
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
