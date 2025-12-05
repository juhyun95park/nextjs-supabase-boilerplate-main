<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.JS_15-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwind" />
    <img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logoColor=white&logo=clerk" alt="clerk" />
    <img src="https://img.shields.io/badge/-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
  </div>

  <h1 align="center">SaaS 템플릿</h1>
  <h3 align="center">Next.js 15 + Clerk + Supabase</h3>

  <p align="center">
    프로덕션 레디 SaaS 애플리케이션을 위한 풀스택 보일러플레이트
  </p>
</div>

## 📋 목차

1. [소개](#소개)
2. [기술 스택](#기술-스택)
3. [주요 기능](#주요-기능)
4. [시작하기](#시작하기)
5. [추가 설정 및 팁](#추가-설정-및-팁)
6. [테스트](#테스트)
7. [배포](#배포)
8. [문서](#문서)
9. [프로젝트 구조](#프로젝트-구조)

## 소개

Next.js 15, Clerk, Supabase를 활용한 모던 SaaS 애플리케이션 템플릿입니다.

**핵심 특징:**
- ✨ Next.js 15 + React 19 최신 기능 활용
- 🔐 Clerk와 Supabase 네이티브 통합 (2025년 권장 방식)
- 🎨 Tailwind CSS v4 + shadcn/ui
- 📱 완전한 반응형 디자인
- 🌐 한국어 지원 (Clerk 한국어 로컬라이제이션)

## 기술 스택

### 프레임워크 & 라이브러리

- **[Next.js 15](https://nextjs.org/)** - React 프레임워크 (App Router, Server Components)
- **[React 19](https://react.dev/)** - UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안정성

### 인증 & 데이터베이스

- **[Clerk](https://clerk.com/)** - 사용자 인증 및 관리
  - Google, 이메일 등 다양한 로그인 방식 지원
  - 한국어 UI 지원
  - Supabase와 네이티브 통합
- **[Supabase](https://supabase.com/)** - PostgreSQL 데이터베이스
  - 실시간 데이터 동기화
  - Row Level Security (RLS)
  - 파일 스토리지

### UI & 스타일링

- **[Tailwind CSS v4](https://tailwindcss.com/)** - 유틸리티 우선 CSS 프레임워크
- **[shadcn/ui](https://ui.shadcn.com/)** - 재사용 가능한 컴포넌트 라이브러리
- **[Radix UI](https://www.radix-ui.com/)** - 접근성 높은 헤드리스 컴포넌트
- **[lucide-react](https://lucide.dev/)** - 아이콘 라이브러리

### 폼 & 검증

- **[React Hook Form](https://react-hook-form.com/)** - 폼 상태 관리
- **[Zod](https://zod.dev/)** - 스키마 검증

## 주요 기능

### 🔐 인증 시스템
- Clerk를 통한 안전한 사용자 인증
- 소셜 로그인 지원 (Google 등)
- Clerk 사용자 자동으로 Supabase DB에 동기화
- 한국어 UI 지원

### 🗄️ 데이터베이스 통합
- **Supabase 공식 패턴 준수**: [Supabase Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs) 기반
- Clerk 토큰 기반 Supabase 인증 (JWT 템플릿 불필요)
- 환경별 Supabase 클라이언트 분리:
  - **공개 데이터용** (`lib/supabase/client.ts`): 인증 불필요한 공개 데이터 접근
  - **Client Component용** (`useClerkSupabaseClient`): Clerk 인증이 필요한 클라이언트 사이드 작업
  - **Server Component용** (`createClerkSupabaseClient`): Clerk 인증이 필요한 서버 사이드 작업
  - **관리자 권한용** (`getServiceRoleClient`): RLS 우회가 필요한 관리 작업
- SQL 마이그레이션 시스템

### 🎨 UI/UX
- shadcn/ui 기반 모던 컴포넌트
- 완전한 반응형 디자인
- 다크/라이트 모드 지원 가능
- 접근성 준수 (WCAG)

### 🏗️ 아키텍처
- Server Actions 우선 사용
- 타입 안전성 보장
- 모듈화된 코드 구조
- Next.js 15 최신 패턴 적용

## 시작하기

### 필수 요구사항

시스템에 다음이 설치되어 있어야 합니다:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 이상)
- [pnpm](https://pnpm.io/) (권장 패키지 매니저)

```bash
# pnpm 설치
npm install -g pnpm
```

### 프로젝트 초기화

다음 단계를 순서대로 진행하세요:

#### 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인
2. **"New Project"** 클릭
3. Organization 선택 (없으면 새로 생성)
4. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성 (기억할 필요 없음, Supabase가 관리)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스용)
   - **Pricing Plan**: Free 또는 Pro 선택
5. **"Create new project"** 클릭하고 프로젝트가 준비될 때까지 대기 (~2분)

#### 2. Clerk 프로젝트 생성

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속하여 로그인
2. **"Create application"** 클릭
3. 애플리케이션 정보 입력:
   - **Application name**: 원하는 이름 (예: `SaaS Template`)
   - **Sign-in options**: Email, Google 등 원하는 인증 방식 선택
4. **"Create application"** 클릭
5. Quick Start 화면에서 **"Continue in Dashboard"** 클릭

#### 3. Clerk + Supabase 네이티브 통합 설정

> **중요**: 2025년 4월부터 Clerk의 네이티브 Supabase 통합을 사용합니다. JWT Template은 더 이상 필요하지 않습니다.

**3-1. Clerk Dashboard에서 Supabase 통합 활성화**

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속
2. 프로젝트 선택 → **Setup** → **Integrations** 메뉴
3. **"Supabase"** 통합 찾기 또는 [Supabase 통합 설정 페이지](https://dashboard.clerk.com/setup/supabase)로 직접 이동
4. **"Activate Supabase integration"** 클릭
5. 통합이 활성화되면 **Clerk domain**이 표시됩니다 (예: `your-app-12.clerk.accounts.dev`)
6. 이 **Clerk domain**을 복사하여 메모해두세요

**3-2. Supabase Dashboard에서 Clerk를 Third-Party Auth Provider로 추가**

1. [Supabase Dashboard](https://supabase.com/dashboard)로 이동
2. 프로젝트 선택 → **Authentication** → **Providers** 메뉴
3. 페이지 하단의 **"Third-Party Auth"** 섹션으로 스크롤
4. **"Add provider"** 클릭
5. 제공자 목록에서 **"Clerk"** 선택
6. **"Clerk domain"** 필드에 3-1에서 복사한 Clerk domain 입력 (예: `your-app-12.clerk.accounts.dev`)
7. **"Save"** 클릭

**3-3. 통합 확인**

통합이 성공적으로 설정되면:
- Clerk에서 로그인한 사용자의 세션 토큰이 Supabase에서 자동으로 검증됩니다
- Supabase RLS 정책에서 `auth.jwt()->>'sub'`로 Clerk user ID를 참조할 수 있습니다
- 추가 JWT 템플릿 설정이 필요하지 않습니다

**참고 문서:**
- [Clerk 공식 Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 문서](https://supabase.com/docs/guides/auth/third-party/overview)

#### 4. Supabase Storage 생성 및 설정

1. Supabase Dashboard → **Storage** 메뉴
2. **"New bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `uploads` (`.env.example`과 동일하게)
   - **Public bucket**: 필요에 따라 선택
     - Public: 누구나 URL로 파일 접근 가능
     - Private: 인증된 사용자만 접근 (RLS 정책 필요)
4. **"Create bucket"** 클릭

#### 5. 데이터베이스 스키마 적용

1. Supabase Dashboard → **SQL Editor** 메뉴
2. **"New query"** 클릭
3. 다음 마이그레이션 파일들을 순서대로 실행:

   **5-1. 기본 스키마 (users 테이블)**
   - `supabase/migrations/setup_schema.sql` 파일 내용을 복사하여 붙여넣기
   - **"Run"** 클릭하여 실행

   **5-2. Tasks 예제 테이블 (선택사항)**
   - `/tasks-example` 페이지를 사용하려면 `supabase/migrations/20250101000000_create_tasks_example.sql` 파일도 실행
   - 이 파일은 Clerk + Supabase 통합의 모범 사례를 보여주는 예제입니다

4. 성공 메시지 확인 (`Success. No rows returned`)

**생성되는 테이블:**
- `users`: Clerk 사용자와 동기화되는 사용자 정보 테이블
- `tasks` (선택사항): Tasks 관리 예제 테이블 (RLS 정책 포함)

#### 6. 환경 변수 설정

**6-1. 저장소 클론 및 의존성 설치**

```bash
git clone <your-repository-url>
cd saas-template
pnpm install
```

**6-2. .env.local 파일 생성**

> **참고**: Supabase 공식 가이드에서는 `.env.local`을 사용합니다. Next.js는 `.env.local`을 자동으로 로드하며, Git에 커밋되지 않습니다.

```bash
# .env.example이 있다면 복사
cp .env.example .env.local

# 또는 직접 생성
touch .env.local
```

**6-3. Supabase 환경 변수 설정**

> **참고**: [Supabase 공식 Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)를 따릅니다.

1. Supabase Dashboard → **Settings** → **API** (또는 **Project Settings** → **API**)
2. 다음 값들을 복사하여 `.env.local` 파일에 입력:
   ```env
   # Supabase 프로젝트 URL 및 키
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   
   # Service Role Key (서버 사이드 전용, RLS 우회)
   SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   
   # Storage 버킷 이름 (선택사항)
   NEXT_PUBLIC_STORAGE_BUCKET="uploads"
   ```

> **⚠️ 중요 보안 주의사항**:
> - `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 클라이언트에 노출되어도 안전합니다 (RLS 정책으로 보호됨)
> - `SUPABASE_SERVICE_ROLE_KEY`는 **절대 공개하지 마세요**. 이 키는 모든 RLS를 우회하는 관리자 권한입니다
> - `.env.local` 파일은 Git에 커밋하지 마세요 (`.gitignore`에 포함되어 있음)

**6-4. Clerk 환경 변수 설정**

1. Clerk Dashboard → **API Keys** (또는 **Developers** → **API Keys**)
2. 다음 값들을 복사하여 `.env.local` 파일에 입력:
   ```env
   # Clerk 인증 키
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   CLERK_SECRET_KEY="sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   
   # Clerk URL 설정 (선택사항, 기본값 사용 가능)
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/"
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/"
   ```

> **참고**: Clerk 키는 [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)에서 확인할 수 있습니다.

#### 7. Cursor MCP 설정 (선택사항)

> Cursor AI를 사용하는 경우, Supabase MCP 서버를 설정하면 AI가 데이터베이스를 직접 조회하고 관리할 수 있습니다.

**7-1. Supabase Access Token 생성**

1. Supabase Dashboard → 우측 상단 프로필 아이콘 클릭
2. **Account Settings** → **Access Tokens**
3. **"Generate new token"** 클릭
4. Token name 입력 (예: `cursor-mcp`)
5. 생성된 토큰 복사 (다시 볼 수 없으므로 안전한 곳에 보관)

**7-2. .cursor/mcp.json 설정**

`.cursor/mcp.json` 파일을 열고 `your_supabase_access_token` 부분을 실제 토큰으로 교체:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ]
    }
  }
}
```

**7-3. Cursor 재시작**

Cursor를 완전히 종료하고 다시 실행하여 MCP 서버 설정을 적용합니다.

#### 8. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

**테스트 및 예제 페이지:**
- `/instruments-example`: Supabase 공식 가이드 예제 (공개 데이터 조회)
- `/tasks-example`: Clerk + Supabase 통합 완전한 예제 (Tasks 관리 앱)
- `/auth-test`: Clerk + Supabase 인증 통합 테스트
- `/storage-test`: Supabase Storage 업로드 테스트

### 개발 명령어

```bash
# 개발 서버 실행 (Turbopack)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린팅
pnpm lint

# E2E 테스트 실행
pnpm test:e2e
```

## 추가 설정 및 팁

### Clerk 한국어 로컬라이제이션

프로젝트에 이미 Clerk 한국어 로컬라이제이션이 적용되어 있습니다.

**기본 설정:**
- `app/layout.tsx`의 `ClerkProvider`에서 `koKR` locale이 설정되어 있습니다
- 모든 Clerk 컴포넌트(로그인, 회원가입, 사용자 버튼 등)가 한국어로 표시됩니다
- Tailwind CSS 4 호환성을 위한 `cssLayerName: "clerk"` 설정이 포함되어 있습니다

**커스텀 로컬라이제이션:**

특정 텍스트나 에러 메시지를 브랜드에 맞게 수정하려면 `lib/clerk/localization.ts` 파일을 사용하세요:

```tsx
// app/layout.tsx
import { customKoKR } from '@/lib/clerk/localization';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customKoKR}>
      {/* ... */}
    </ClerkProvider>
  );
}
```

**에러 메시지 커스터마이징:**

`lib/clerk/localization.ts` 파일에서 `unstable__errors` 객체를 수정하여 에러 메시지를 커스터마이징할 수 있습니다:

```typescript
export const customKoKR = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access: "접근이 허용되지 않은 이메일 도메인입니다.",
    form_identifier_not_found: "입력하신 이메일을 찾을 수 없습니다.",
  },
};
```

> **참고**: Clerk 로컬라이제이션 기능은 현재 실험적(experimental)입니다. 자세한 내용은 [Clerk 로컬라이제이션 가이드](https://clerk.com/docs/guides/customizing-clerk/localization)를 참고하세요.

### Supabase RLS (Row Level Security) 정책

프로젝트의 `users` 테이블에는 기본 RLS 정책이 설정되어 있습니다:

- **SELECT**: 사용자는 자신의 데이터만 조회 가능
- **INSERT**: 새 사용자 생성 가능
- **UPDATE**: 사용자는 자신의 데이터만 수정 가능

추가 테이블 생성 시 RLS 정책을 반드시 설정하세요:

```sql
-- 테이블 생성
CREATE TABLE your_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES users(clerk_id),
  -- 기타 컬럼들
);

-- RLS 활성화
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- SELECT 정책
CREATE POLICY "Users can view their own data"
  ON your_table FOR SELECT
  USING (auth.jwt()->>'sub' = user_id);

-- INSERT 정책
CREATE POLICY "Users can insert their own data"
  ON your_table FOR INSERT
  WITH CHECK (auth.jwt()->>'sub' = user_id);
```

### 추가 로그인 방식 설정

Clerk에서 추가 로그인 방식을 활성화하려면:

1. Clerk Dashboard → **User & Authentication** → **Social Connections**
2. 원하는 제공자 선택 (Google, GitHub, Discord 등)
3. OAuth 자격 증명 입력 (제공자 개발자 콘솔에서 생성)
4. **Enable** 클릭

## 프로젝트 구조

```
saas-template/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── sync-user/    # Clerk → Supabase 사용자 동기화
│   ├── auth-test/        # 인증 테스트 페이지
│   ├── storage-test/     # 스토리지 테스트 페이지
│   ├── layout.tsx        # Root Layout (Clerk Provider)
│   ├── page.tsx          # 홈페이지
│   └── globals.css       # 전역 스타일 (Tailwind v4 설정)
│
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트 (자동 생성)
│   ├── providers/        # Context Providers
│   │   └── sync-user-provider.tsx
│   └── Navbar.tsx        # 네비게이션 바
│
├── lib/                   # 유틸리티 및 설정
│   ├── supabase/         # Supabase 클라이언트들
│   │   ├── clerk-client.ts    # Client Component용
│   │   ├── server.ts          # Server Component용
│   │   ├── service-role.ts    # 관리자용
│   │   └── client.ts          # 공개 데이터용
│   └── utils.ts          # 공통 유틸리티 (cn 함수 등)
│
├── hooks/                 # Custom React Hooks
│   └── use-sync-user.ts  # 사용자 동기화 훅
│
├── supabase/             # Supabase 관련 파일
│   ├── migrations/       # 데이터베이스 마이그레이션
│   │   └── schema.sql   # 초기 스키마
│   └── config.toml       # Supabase 프로젝트 설정
│
├── .cursor/              # Cursor AI 규칙
│   └── rules/           # 개발 컨벤션 및 가이드
│
├── middleware.ts         # Next.js 미들웨어 (Clerk)
├── .env.example         # 환경 변수 예시
└── CLAUDE.md            # AI 에이전트용 프로젝트 가이드
```

### 주요 파일 설명

- **`middleware.ts`**: Clerk 인증 미들웨어 설정
- **`app/layout.tsx`**: ClerkProvider와 SyncUserProvider 설정
- **`lib/supabase/`**: 환경별 Supabase 클라이언트 (매우 중요!)
- **`hooks/use-sync-user.ts`**: Clerk 사용자를 Supabase에 자동 동기화
- **`components/providers/sync-user-provider.tsx`**: 앱 전역에서 사용자 동기화 실행
- **`CLAUDE.md`**: Claude Code를 위한 프로젝트 가이드

## 테스트

### E2E 테스트

프로젝트는 Playwright를 사용하여 E2E 테스트를 포함하고 있습니다.

**테스트 실행:**

```bash
# 모든 E2E 테스트 실행
pnpm test:e2e

# UI 모드로 테스트 실행 (브라우저에서 확인)
pnpm test:e2e --ui

# 특정 테스트 파일만 실행
pnpm test:e2e tests/e2e/auth.spec.ts
```

**테스트 커버리지:**

- 인증 플로우 (로그인/회원가입/로그아웃)
- 상품 조회 플로우
- 장바구니 플로우
- 주문 및 결제 플로우
- 주문 내역 조회 플로우

자세한 내용은 [Playwright 테스트 가이드](.cursor/rules/web/playwright-test-guide.mdc)를 참고하세요.

## 배포

### Vercel 배포

프로젝트는 Vercel에 최적화되어 있습니다.

**배포 단계:**

1. [Vercel CLI 설치](https://vercel.com/docs/cli) 및 로그인
2. 프로젝트 디렉토리에서 배포:
   ```bash
   vercel
   ```
3. 환경 변수 설정 (Vercel Dashboard 또는 CLI)

**환경 변수 설정:**

Vercel Dashboard → Project Settings → Environment Variables에서 다음 변수들을 설정하세요:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` (결제 기능 사용 시)

자세한 배포 가이드는 [배포 문서](docs/vercel-deployment.md)를 참고하세요.

## 문서

프로젝트의 상세 문서는 `docs/` 디렉토리에 있습니다:

- **[배포 가이드](docs/vercel-deployment.md)**: Vercel 배포 및 환경 변수 설정
- **[Supabase 통합 가이드](docs/supabase-integration.md)**: Supabase 클라이언트 사용법
- **[Clerk 로컬라이제이션](docs/clerk-localization.md)**: 한국어 UI 설정
- **[운영 가이드](docs/operating-guide.md)**: 환경 변수, 데이터베이스, 모니터링, 문제 해결
- **[개발 가이드](docs/development-guide.md)**: 코드 스타일, 컴포넌트 작성, 테스트, Git 워크플로우
- **[PRD](docs/prd.md)**: 프로젝트 요구사항 및 기능 명세

## 추가 리소스

- [Next.js 15 문서](https://nextjs.org/docs)
- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Playwright 문서](https://playwright.dev/)
