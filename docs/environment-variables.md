# 환경 변수 가이드

이 문서는 프로젝트에서 사용하는 모든 환경 변수에 대한 상세 설명을 제공합니다.

## 필수 환경 변수

### Clerk 인증

#### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **설명**: Clerk 공개 키 (클라이언트에서 사용)
- **타입**: 문자열
- **형식**: `pk_test_...` 또는 `pk_live_...`
- **발급 위치**: [Clerk Dashboard](https://dashboard.clerk.com/) → Your Application → API Keys
- **보안**: 공개 키이므로 클라이언트에 노출되어도 안전
- **예시**: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### `CLERK_SECRET_KEY`
- **설명**: Clerk 시크릿 키 (서버 사이드 전용)
- **타입**: 문자열
- **형식**: `sk_test_...` 또는 `sk_live_...`
- **발급 위치**: [Clerk Dashboard](https://dashboard.clerk.com/) → Your Application → API Keys
- **보안**: **절대 클라이언트에 노출 금지**. 서버 사이드에서만 사용
- **예시**: `sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- **설명**: 로그인 페이지 URL
- **타입**: 문자열
- **기본값**: `/sign-in`
- **설명**: Clerk가 자동으로 생성하는 로그인 페이지 경로

#### `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- **설명**: 로그인 성공 후 리다이렉트할 URL
- **타입**: 문자열
- **기본값**: `/`
- **예시**: `/dashboard`, `/home`

#### `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
- **설명**: 회원가입 성공 후 리다이렉트할 URL
- **타입**: 문자열
- **기본값**: `/`
- **예시**: `/welcome`, `/onboarding`

### Supabase

#### `NEXT_PUBLIC_SUPABASE_URL`
- **설명**: Supabase 프로젝트 URL
- **타입**: 문자열
- **형식**: `https://your-project.supabase.co`
- **발급 위치**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project URL
- **보안**: 공개 URL이므로 클라이언트에 노출되어도 안전
- **예시**: `https://abcdefghijklmnop.supabase.co`

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **설명**: Supabase 공개 키 (클라이언트에서 사용)
- **타입**: 문자열
- **형식**: JWT 토큰
- **발급 위치**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project API keys → anon public
- **보안**: 공개 키이지만 RLS 정책으로 보호됨
- **예시**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### `SUPABASE_SERVICE_ROLE_KEY`
- **설명**: Supabase 서비스 역할 키 (관리자 권한)
- **타입**: 문자열
- **형식**: JWT 토큰
- **발급 위치**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Project API keys → service_role secret
- **보안**: **절대 클라이언트에 노출 금지**. RLS를 우회하므로 매우 위험
- **용도**: 서버 사이드 관리 작업, 마이그레이션 실행 등
- **예시**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### `NEXT_PUBLIC_STORAGE_BUCKET`
- **설명**: Supabase Storage 버킷 이름
- **타입**: 문자열
- **기본값**: `uploads`
- **설명**: 파일 업로드에 사용할 Storage 버킷 이름
- **예시**: `uploads`, `images`, `documents`

## 선택적 환경 변수

### Toss Payments

#### `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`
- **설명**: Toss Payments 클라이언트 키 (테스트 모드)
- **타입**: 문자열
- **형식**: `test_ck_...` (테스트) 또는 `live_ck_...` (프로덕션)
- **발급 위치**: [Toss Payments 개발자센터](https://developers.tosspayments.com/) → 테스트 모드 → 키 발급
- **보안**: 공개 키이므로 클라이언트에 노출되어도 안전
- **예시**: `test_ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### `TOSS_PAYMENTS_SECRET_KEY`
- **설명**: Toss Payments 시크릿 키 (서버 사이드 전용)
- **타입**: 문자열
- **형식**: `test_sk_...` (테스트) 또는 `live_sk_...` (프로덕션)
- **발급 위치**: [Toss Payments 개발자센터](https://developers.tosspayments.com/) → 테스트 모드 → 키 발급
- **보안**: **절대 클라이언트에 노출 금지**
- **예시**: `test_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Playwright E2E 테스트

#### `PLAYWRIGHT_TEST_BASE_URL`
- **설명**: E2E 테스트 실행 시 사용할 기본 URL
- **타입**: 문자열
- **기본값**: `http://localhost:3000`
- **용도**: Playwright 테스트가 실행될 애플리케이션 URL
- **예시**: `http://localhost:3000`, `https://staging.example.com`

## 환경 변수 설정 방법

### 로컬 개발 환경

1. 프로젝트 루트에 `.env.local` 파일 생성
2. `.env.example` 파일을 복사하여 `.env.local`로 이름 변경
3. 각 환경 변수에 실제 값 입력

```bash
# .env.example을 .env.local로 복사
cp .env.example .env.local

# .env.local 파일 편집
# 각 환경 변수에 실제 값 입력
```

### Vercel 배포 환경

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 이동
4. 각 환경 변수 추가:
   - **Key**: 환경 변수 이름
   - **Value**: 환경 변수 값
   - **Environment**: Production, Preview, Development 중 선택

또는 Vercel CLI 사용:

```bash
# 환경 변수 추가
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production

# 환경 변수 목록 확인
vercel env ls

# 환경 변수 삭제
vercel env rm VARIABLE_NAME production
```

## 보안 고려사항

### 공개 키 (NEXT_PUBLIC_*)
- 클라이언트 번들에 포함됨
- 브라우저에서 접근 가능
- RLS 정책이나 다른 보안 메커니즘으로 보호 필요

### 시크릿 키 (SECRET_KEY, SERVICE_ROLE_KEY)
- **절대 클라이언트에 노출 금지**
- 서버 사이드에서만 사용
- Git 저장소에 커밋하지 않음 (`.gitignore`에 포함)
- 환경 변수로만 관리

### 권장 사항
1. 프로덕션과 개발 환경의 키를 분리
2. 정기적으로 키 로테이션
3. 키 유출 시 즉시 재발급
4. `.env.local` 파일을 `.gitignore`에 포함

## 문제 해결

### 환경 변수가 적용되지 않는 경우
1. 서버 재시작 확인 (Next.js는 환경 변수 변경 시 재시작 필요)
2. 환경 변수 이름 확인 (대소문자 구분)
3. `.env.local` 파일 위치 확인 (프로젝트 루트)
4. Vercel 배포 시 환경 변수 설정 확인

### 빌드 오류
- 필수 환경 변수가 누락된 경우 빌드가 실패할 수 있습니다
- 모든 `NEXT_PUBLIC_*` 환경 변수는 빌드 타임에 필요합니다
- Vercel Dashboard에서 환경 변수 설정을 확인하세요

## 참고 자료

- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Clerk Environment Variables](https://clerk.com/docs/quickstarts/nextjs#environment-variables)
- [Supabase Environment Variables](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

