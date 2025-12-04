/**
 * @file app/instruments-example/page.tsx
 * @description Supabase 공식 Next.js 가이드 예제
 *
 * 이 페이지는 Supabase 공식 Next.js 가이드의 예제를 기반으로 작성되었습니다.
 * 공개 데이터에 접근하는 방법을 보여줍니다.
 *
 * @see {@link https://supabase.com/docs/guides/getting-started/quickstarts/nextjs} - Supabase 공식 가이드
 */

import { supabase } from "@/lib/supabase/client";
import { Suspense } from "react";

/**
 * Instruments 데이터를 조회하는 Server Component
 * 
 * Supabase 공식 가이드의 패턴을 따릅니다:
 * - 공개 데이터용 클라이언트 사용
 * - Server Component에서 직접 데이터 조회
 * - Suspense로 로딩 상태 처리
 */
async function InstrumentsData() {
  // 공개 데이터용 Supabase 클라이언트 사용
  // RLS 정책이 'to anon'인 데이터만 조회 가능
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching instruments:", error);
    return (
      <div className="text-red-500">
        데이터를 불러오는 중 오류가 발생했습니다: {error.message}
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="text-muted-foreground">
        악기 데이터가 없습니다. Supabase Dashboard에서 instruments 테이블을 생성하고 데이터를 추가해보세요.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {instruments.map((instrument: { id: number; name: string }) => (
        <div
          key={instrument.id}
          className="p-4 border rounded-md hover:bg-accent/50 transition-colors"
        >
          {instrument.name}
        </div>
      ))}
    </div>
  );
}

/**
 * Instruments 페이지
 * 
 * Supabase 공식 가이드의 패턴:
 * - Suspense로 로딩 상태 처리
 * - Server Component에서 데이터 조회
 */
export default function InstrumentsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Instruments</h1>
      <p className="text-muted-foreground mb-8">
        Supabase 공식 Next.js 가이드 예제입니다. 공개 데이터를 조회합니다.
      </p>

      <Suspense fallback={<div>Loading instruments...</div>}>
        <InstrumentsData />
      </Suspense>

      <div className="mt-8 p-4 bg-muted rounded-md">
        <h2 className="font-semibold mb-2">데이터베이스 설정</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Supabase SQL Editor에서 다음 쿼리를 실행하여 테이블을 생성하세요:
        </p>
        <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
          {`-- instruments 테이블 생성
CREATE TABLE IF NOT EXISTS instruments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

-- 샘플 데이터 삽입
INSERT INTO instruments (name)
VALUES
  ('violin'),
  ('viola'),
  ('cello');

-- RLS 활성화
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
CREATE POLICY "public can read instruments"
ON instruments
FOR SELECT
TO anon
USING (true);`}
        </pre>
      </div>
    </div>
  );
}

