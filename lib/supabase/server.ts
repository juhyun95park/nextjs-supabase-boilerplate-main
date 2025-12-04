/**
 * @file server.ts
 * @description Clerk + Supabase 네이티브 통합 클라이언트 (Server Component/Server Action용)
 *
 * 이 파일은 서버 사이드에서 Clerk와 Supabase를 통합하는 함수를 제공합니다.
 * Server Components, Server Actions, API Routes에서 사용할 수 있습니다.
 *
 * 주요 기능:
 * 1. Clerk 세션 토큰을 Supabase 요청에 자동 주입
 * 2. 서버 사이드에서 인증된 사용자의 데이터 접근
 * 3. RLS 정책이 auth.jwt()->>'sub'로 Clerk user ID 확인
 *
 * 핵심 구현 로직:
 * - auth().getToken()으로 Clerk 세션 토큰 획득
 * - createClient의 accessToken 옵션으로 토큰 자동 주입
 * - Supabase가 Clerk를 third-party auth provider로 인식하여 검증
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase 클라이언트 라이브러리
 * - @clerk/nextjs/server: Clerk 서버 사이드 인증
 *
 * @see {@link https://supabase.com/docs/guides/getting-started/quickstarts/nextjs} - Supabase Next.js 공식 가이드
 * @see {@link https://clerk.com/docs/guides/development/integrations/databases/supabase} - Clerk Supabase 통합 가이드
 */

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 생성 (Server Component/Server Action용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요 (네이티브 통합 사용)
 * - Clerk를 Supabase의 third-party auth provider로 설정
 * - auth().getToken()으로 현재 세션 토큰 사용
 * - 서버 사이드에서만 사용 가능
 *
 * @returns Supabase 클라이언트 인스턴스 (Clerk 토큰이 자동 주입됨)
 *
 * @example
 * ```tsx
 * // Server Component
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function TasksPage() {
 *   const supabase = createClerkSupabaseClient();
 *   const { data, error } = await supabase
 *     .from('tasks')
 *     .select('*');
 *
 *   if (error) throw error;
 *
 *   return (
 *     <div>
 *       {data?.map(task => (
 *         <div key={task.id}>{task.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```ts
 * // Server Action
 * 'use server';
 *
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export async function createTask(name: string) {
 *   const supabase = createClerkSupabaseClient();
 *   const { data, error } = await supabase
 *     .from('tasks')
 *     .insert({ name });
 *
 *   if (error) throw error;
 *   return data;
 * }
 * ```
 */
export function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase URL or Anon Key is missing. Please check your environment variables."
    );
  }

  return createClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      // Clerk 세션 토큰을 Supabase 요청에 자동 주입
      // Supabase가 Clerk를 third-party auth provider로 인식하여 검증
      return (await auth()).getToken();
    },
  });
}
