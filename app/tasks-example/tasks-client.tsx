/**
 * @file app/tasks-example/tasks-client.tsx
 * @description Tasks 관리 Client Component
 *
 * Client Component에서 Clerk + Supabase 통합을 사용하는 예제입니다.
 * 
 * 주요 기능:
 * 1. useClerkSupabaseClient 훅으로 Supabase 클라이언트 사용
 * 2. 실시간으로 tasks 추가/수정/삭제
 * 3. Clerk 세션 토큰이 자동으로 주입됨
 */

"use client";

import { useState, useTransition } from "react";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  name: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface TasksClientProps {
  initialTasks: Task[];
}

export default function TasksClient({ initialTasks }: TasksClientProps) {
  const supabase = useClerkSupabaseClient();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [taskName, setTaskName] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleCreateTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!taskName.trim()) {
      return;
    }

    startTransition(async () => {
      try {
        // Clerk 토큰이 자동으로 주입되어 RLS 정책이 적용됨
        const { data, error } = await supabase
          .from("tasks")
          .insert({
            name: taskName.trim(),
            completed: false,
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating task:", error);
          alert(`작업 생성 실패: ${error.message}`);
          return;
        }

        // 성공 시 상태 업데이트 및 페이지 새로고침
        setTasks((prev) => [data, ...prev]);
        setTaskName("");
        router.refresh();
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("예상치 못한 오류가 발생했습니다.");
      }
    });
  }

  async function handleToggleTask(taskId: number, currentCompleted: boolean) {
    startTransition(async () => {
      try {
        const { error } = await supabase
          .from("tasks")
          .update({ completed: !currentCompleted })
          .eq("id", taskId);

        if (error) {
          console.error("Error updating task:", error);
          alert(`작업 업데이트 실패: ${error.message}`);
          return;
        }

        // 상태 업데이트
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, completed: !currentCompleted }
              : task
          )
        );
        router.refresh();
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("예상치 못한 오류가 발생했습니다.");
      }
    });
  }

  async function handleDeleteTask(taskId: number) {
    if (!confirm("이 작업을 삭제하시겠습니까?")) {
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId);

        if (error) {
          console.error("Error deleting task:", error);
          alert(`작업 삭제 실패: ${error.message}`);
          return;
        }

        // 상태 업데이트
        setTasks((prev) => prev.filter((task) => task.id !== taskId));
        router.refresh();
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("예상치 못한 오류가 발생했습니다.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* 작업 추가 폼 */}
      <form onSubmit={handleCreateTask} className="flex gap-2">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="새 작업 입력..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isPending}
        />
        <button
          type="submit"
          disabled={isPending || !taskName.trim()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "추가 중..." : "추가"}
        </button>
      </form>

      {/* 작업 목록 */}
      {tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>아직 작업이 없습니다. 위에서 새 작업을 추가해보세요!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-4 border rounded-md hover:bg-accent/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task.id, task.completed)}
                disabled={isPending}
                className="w-5 h-5 cursor-pointer"
              />
              <span
                className={`flex-1 ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : ""
                }`}
              >
                {task.name}
              </span>
              <button
                onClick={() => handleDeleteTask(task.id)}
                disabled={isPending}
                className="px-3 py-1 text-sm text-destructive hover:bg-destructive/10 rounded disabled:opacity-50"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 통계 */}
      <div className="text-sm text-muted-foreground pt-4 border-t">
        총 {tasks.length}개 작업 중 {tasks.filter((t) => t.completed).length}개
        완료
      </div>
    </div>
  );
}

