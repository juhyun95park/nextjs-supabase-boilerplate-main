# 개발 가이드

이 문서는 프로젝트 개발을 위한 가이드라인과 컨벤션을 제공합니다.

## 목차

1. [코드 스타일](#코드-스타일)
2. [컴포넌트 작성](#컴포넌트-작성)
3. [테스트 작성](#테스트-작성)
4. [Git 워크플로우](#git-워크플로우)

## 코드 스타일

### TypeScript

**타입 정의:**
- 인터페이스 우선 사용, 타입은 필요시만
- `satisfies` 연산자로 타입 검증
- enum 대신 const 객체 사용

```typescript
// ✅ 좋은 예
interface User {
  id: string;
  name: string;
}

const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

// ❌ 나쁜 예
type User = {
  id: string;
  name: string;
};

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}
```

**타입 안전성:**
- 모든 함수에 명시적 타입 지정
- `any` 사용 금지
- Zod 스키마로 런타임 검증

### 파일 네이밍

- **파일명**: kebab-case (예: `use-sync-user.ts`, `sync-user-provider.tsx`)
- **컴포넌트**: PascalCase (파일명은 kebab-case)
- **함수/변수**: camelCase
- **타입/인터페이스**: PascalCase

### 디렉토리 구조

```
app/                    # 라우팅 전용 (page.tsx, layout.tsx, route.ts만)
components/             # 재사용 가능한 컴포넌트
  ui/                   # shadcn 컴포넌트 (자동 생성, 수정 금지)
  providers/            # React Context 프로바이더
lib/                    # 유틸리티 함수 및 클라이언트 설정
  supabase/            # Supabase 클라이언트들
hooks/                  # 커스텀 React Hook들
actions/                # Server Actions
types/                  # TypeScript 타입 정의
```

## 컴포넌트 작성

### Server Component 우선

Next.js 15에서는 Server Component를 기본으로 사용합니다.

```typescript
// ✅ Server Component (기본)
export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsList products={products} />;
}

// ✅ Client Component (필요한 경우만)
"use client";

export function ProductCard({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  // ...
}
```

### 컴포넌트 구조

```typescript
/**
 * @file components/product-card.tsx
 * @description 상품 카드 컴포넌트
 *
 * 개별 상품을 카드 형태로 표시하는 컴포넌트입니다.
 *
 * 주요 기능:
 * - 상품 이미지, 이름, 가격 표시
 * - 카테고리 태그 표시
 * - 재고 상태 표시
 *
 * @dependencies
 * - @/types/product: Product 타입
 * - @/lib/utils: cn 함수
 */

import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // 컴포넌트 로직
  return (
    // JSX
  );
}
```

### 공통 UI 컴포넌트 사용

**로딩 상태:**
```typescript
import { PageLoading, Spinner } from "@/components/ui/loading";

// 전체 페이지 로딩
<PageLoading message="로딩 중..." />

// 인라인 로딩
<Spinner size="md" text="처리 중..." />
```

**에러 상태:**
```typescript
import { ErrorMessage } from "@/components/ui/error-boundary";

<ErrorMessage
  message="에러가 발생했습니다"
  description="상세 에러 메시지"
  onRetry={() => retry()}
/>
```

**빈 상태:**
```typescript
import { EmptyState } from "@/components/ui/empty-state";
import { PackageX } from "lucide-react";

<EmptyState
  icon={<PackageX className="h-16 w-16" />}
  title="데이터가 없습니다"
  description="설명 텍스트"
  actionLabel="액션 버튼"
  actionHref="/path"
/>
```

## 테스트 작성

### E2E 테스트 (Playwright)

**테스트 파일 구조:**
```typescript
import { test, expect } from "@playwright/test";

test.describe("기능명", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("테스트 케이스 설명", async ({ page }) => {
    await test.step("단계 1", async () => {
      // 테스트 코드
    });

    await test.step("단계 2", async () => {
      // 검증 코드
      await expect(page.getByText("예상 결과")).toBeVisible();
    });
  });
});
```

**테스트 실행:**
```bash
# 모든 테스트 실행
pnpm test:e2e

# UI 모드로 실행
pnpm test:e2e --ui

# 특정 파일만 실행
pnpm test:e2e tests/e2e/auth.spec.ts
```

**테스트 작성 가이드:**
- [Playwright 테스트 가이드](.cursor/rules/web/playwright-test-guide.mdc) 참고

## Git 워크플로우

### 브랜치 전략

**메인 브랜치:**
- `main`: 프로덕션 배포용 브랜치
- `develop`: 개발 통합 브랜치 (선택사항)

**기능 브랜치:**
- `feature/기능명`: 새 기능 개발
- `fix/버그명`: 버그 수정
- `docs/문서명`: 문서 업데이트

### 커밋 메시지

**커밋 메시지 형식:**
```
타입(범위): 간단한 설명

상세 설명 (선택사항)
```

**타입:**
- `feat`: 새 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경

**예시:**
```
feat(cart): 장바구니 수량 변경 기능 추가

- updateCartItemQuantity Server Action 구현
- CartItem 컴포넌트에 수량 변경 UI 추가
- 재고 검증 로직 추가
```

### Pull Request

**PR 작성 체크리스트:**
- [ ] 코드 리뷰 요청
- [ ] 변경 사항 설명
- [ ] 관련 이슈 링크
- [ ] 테스트 완료 확인
- [ ] 빌드 성공 확인

## Server Actions 작성

### 기본 구조

```typescript
"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Zod 스키마로 입력값 검증
const inputSchema = z.object({
  // ...
});

export async function actionName(input: InputType) {
  try {
    // 1. 입력값 검증
    const validationResult = inputSchema.safeParse(input);
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.errors[0]?.message,
      };
    }

    // 2. 인증 확인
    const { userId } = await auth();
    if (!userId) {
      throw new Error("인증이 필요합니다.");
    }

    // 3. 비즈니스 로직
    const supabase = createClerkSupabaseClient();
    // ...

    // 4. 캐시 무효화
    revalidatePath("/path");

    return {
      success: true,
      message: "성공 메시지",
    };
  } catch (error) {
    console.error("Error in actionName:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "알 수 없는 오류",
    };
  }
}
```

### 에러 처리

- 모든 Server Action에서 try-catch 사용
- 사용자 친화적인 에러 메시지 반환
- 개발 환경에서만 상세 에러 로깅

## 폼 작성

### React Hook Form + Zod

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  email: z.string().email("올바른 이메일 형식이 아닙니다."),
});

type FormData = z.infer<typeof formSchema>;

export function MyForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    // Server Action 호출
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* 폼 필드 */}
      </form>
    </Form>
  );
}
```

## 추가 리소스

- [Next.js 15 문서](https://nextjs.org/docs)
- [React 19 문서](https://react.dev/)
- [TypeScript 문서](https://www.typescriptlang.org/docs/)
- [Zod 문서](https://zod.dev/)
- [React Hook Form 문서](https://react-hook-form.com/)
- [Playwright 문서](https://playwright.dev/)

