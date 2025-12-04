/**
 * @file clerk-client.ts
 * @description Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * 이 파일은 Clerk와 Supabase의 네이티브 통합을 제공하는 React Hook입니다.
 * 2025년 4월부터 권장되는 방식으로, JWT 템플릿 없이 Clerk 세션 토큰을 직접 사용합니다.
 *
 * 주요 기능:
 * 1. Clerk 세션 토큰을 Supabase 요청에 자동 주입
 * 2. React Hook으로 제공되어 Client Component에서 사용
 * 3. useMemo를 사용한 클라이언트 인스턴스 최적화
 *
 * 핵심 구현 로직:
 * - useAuth().getToken()으로 Clerk 세션 토큰 획득
 * - createClient의 accessToken 옵션으로 토큰 자동 주입
 * - Supabase가 Clerk를 third-party auth provider로 인식하여 검증
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase 클라이언트 라이브러리
 * - @clerk/nextjs: Clerk 인증 라이브러리
 *
 * @see {@link https://clerk.com/docs/guides/development/integrations/databases/supabase} - Clerk Supabase 통합 가이드
 * @see {@link https://supabase.com/docs/guides/auth/third-party/clerk} - Supabase Clerk 통합 문서
 */

"use client";

import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 Hook (Client Component용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요 (네이티브 통합 사용)
 * - Clerk를 Supabase의 third-party auth provider로 설정
 * - useAuth().getToken()으로 현재 세션 토큰 사용
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @returns Supabase 클라이언트 인스턴스 (Clerk 토큰이 자동 주입됨)
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 * import { useEffect, useState } from 'react';
 *
 * export default function TasksList() {
 *   const supabase = useClerkSupabaseClient();
 *   const [tasks, setTasks] = useState([]);
 *
 *   useEffect(() => {
 *     async function loadTasks() {
 *       const { data, error } = await supabase
 *         .from('tasks')
 *         .select('*');
 *       if (!error) setTasks(data || []);
 *     }
 *     loadTasks();
 *   }, [supabase]);
 *
 *   return (
 *     <div>
 *       {tasks.map(task => (
 *         <div key={task.id}>{task.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { getToken } = useAuth();

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        "Supabase URL or Anon Key is missing. Please check your environment variables."
      );
    }

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        // Clerk 세션 토큰을 Supabase 요청에 자동 주입
        // Supabase가 Clerk를 third-party auth provider로 인식하여 검증
        return (await getToken()) ?? null;
      },
    });
  }, [getToken]);

  return supabase;
}
