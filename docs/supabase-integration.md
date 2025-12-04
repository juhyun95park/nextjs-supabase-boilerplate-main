# Supabase 통합 가이드

이 문서는 Supabase 공식 Next.js 가이드를 기반으로 작성되었습니다.

## 참고 문서

- [Supabase Next.js 공식 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Clerk Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)

## Supabase 클라이언트 사용 가이드

이 프로젝트는 Supabase 공식 패턴을 따르며, Clerk와의 통합을 지원합니다.

### 1. 공개 데이터용 클라이언트

인증이 필요 없는 공개 데이터에 접근할 때 사용합니다.

```tsx
// Server Component
import { supabase } from '@/lib/supabase/client';

export default async function PublicPage() {
  const { data } = await supabase
    .from('public_posts')
    .select('*')
    .eq('published', true);

  return <div>{/* 렌더링 */}</div>;
}
```

```tsx
// Client Component
'use client';

import { supabase } from '@/lib/supabase/client';

export default function PublicList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from('public_products')
        .select('*');
      setData(data || []);
    }
    fetchData();
  }, []);

  return <div>{/* 렌더링 */}</div>;
}
```

### 2. Clerk 인증이 필요한 경우

#### Server Component / Server Action

```tsx
import { createClerkSupabaseClient } from '@/lib/supabase/server';

export default async function TasksPage() {
  const supabase = createClerkSupabaseClient();
  const { data, error } = await supabase
    .from('tasks')
    .select('*');

  if (error) throw error;
  return <div>{/* 렌더링 */}</div>;
}
```

#### Client Component

```tsx
'use client';

import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';

export default function TasksList() {
  const supabase = useClerkSupabaseClient();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function loadTasks() {
      const { data } = await supabase
        .from('tasks')
        .select('*');
      setTasks(data || []);
    }
    loadTasks();
  }, [supabase]);

  return <div>{/* 렌더링 */}</div>;
}
```

### 3. 관리자 권한이 필요한 경우

RLS를 우회해야 하는 경우에만 사용합니다. **절대 클라이언트에 노출하지 마세요.**

```tsx
import { getServiceRoleClient } from '@/lib/supabase/service-role';

export async function POST() {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from('users')
    .select('*');

  return Response.json({ data, error });
}
```

## 환경 변수

Supabase 공식 가이드를 따릅니다:

```env
# Supabase 프로젝트 URL 및 공개 키
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Service Role Key (서버 사이드 전용)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

> **참고**: Supabase 공식 문서에서는 `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`를 사용하기도 하지만, 일반적으로 `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 사용합니다. 둘 다 동일한 값입니다.

## RLS (Row Level Security) 정책

Clerk와 통합할 때는 `auth.jwt()->>'sub'`로 Clerk user ID를 참조합니다:

```sql
-- 사용자는 자신의 데이터만 조회 가능
CREATE POLICY "Users can view their own tasks"
ON tasks FOR SELECT TO authenticated
USING ((SELECT auth.jwt()->>'sub') = user_id);
```

## 예제

완전한 예제는 `/tasks-example` 페이지를 참고하세요.

