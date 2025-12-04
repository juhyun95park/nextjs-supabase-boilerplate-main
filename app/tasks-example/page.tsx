/**
 * @file app/tasks-example/page.tsx
 * @description Clerk + Supabase 통합 예제: Tasks 관리 페이지
 *
 * 이 페이지는 Clerk와 Supabase의 네이티브 통합을 보여주는 완전한 예제입니다.
 * 
 * 주요 기능:
 * 1. Server Component에서 Supabase 데이터 조회
 * 2. Client Component에서 실시간 데이터 업데이트
 * 3. RLS 정책으로 사용자별 데이터 분리
 *
 * @see {@link https://clerk.com/docs/guides/development/integrations/databases/supabase} - Clerk Supabase 통합 가이드
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import TasksClient from "./tasks-client";

export default async function TasksPage() {
  // 인증 확인
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Clerk 토큰이 자동으로 주입된 Supabase 클라이언트 생성
  const supabase = createClerkSupabaseClient();

  // 사용자의 tasks 조회 (RLS 정책에 의해 자동으로 필터링됨)
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tasks:", error);
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      <p className="text-muted-foreground mb-8">
        Clerk + Supabase 통합 예제입니다. RLS 정책으로 자신의 tasks만 표시됩니다.
      </p>

      <TasksClient initialTasks={tasks || []} />
    </div>
  );
}

