# Vercel 배포 가이드

이 문서는 Vercel CLI를 사용하여 Next.js 프로젝트를 배포하는 방법을 설명합니다.

## 사전 요구사항

1. **Vercel CLI 설치**
   ```bash
   npm install -g vercel
   # 또는
   pnpm add -g vercel
   ```

2. **Vercel 계정 로그인**
   ```bash
   vercel login
   ```

## 배포 단계

### 1. 프로젝트 빌드 테스트

배포 전에 로컬에서 빌드가 성공하는지 확인:

```bash
pnpm build
```

### 2. Vercel 배포

#### 첫 배포 (프로젝트 연결)

```bash
vercel
```

이 명령은 다음을 수행합니다:
- 프로젝트를 Vercel에 연결
- 배포 설정 확인
- 프로덕션 배포 실행

#### 이후 배포

```bash
# 프로덕션 배포
vercel --prod

# 프리뷰 배포 (기본값)
vercel
```

### 3. 환경 변수 설정

Vercel Dashboard에서 환경 변수를 설정해야 합니다:

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Settings** → **Environment Variables** 이동
4. 다음 환경 변수 추가:

#### Clerk 환경 변수

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

#### Supabase 환경 변수

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

#### 환경별 설정

각 환경(Production, Preview, Development)에 대해 환경 변수를 설정할 수 있습니다:
- **Production**: 프로덕션 배포에만 적용
- **Preview**: 프리뷰 배포에만 적용
- **Development**: 로컬 개발에만 적용

### 4. CLI로 환경 변수 설정 (선택사항)

```bash
# 환경 변수 추가
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production

# 환경 변수 목록 확인
vercel env ls

# 환경 변수 삭제
vercel env rm VARIABLE_NAME production
```

## 배포 후 확인

### 배포 URL 확인

배포가 완료되면 다음 URL이 제공됩니다:
- **프로덕션**: `https://your-project.vercel.app`
- **프리뷰**: `https://your-project-{hash}.vercel.app`

### 배포 상태 확인

```bash
# 배포 목록 확인
vercel ls

# 특정 배포 상세 정보
vercel inspect [deployment-url]
```

## 자동 배포 설정

### Git 연동

Vercel은 Git 저장소와 연동하여 자동 배포를 설정할 수 있습니다:

1. Vercel Dashboard → **Settings** → **Git**
2. GitHub/GitLab/Bitbucket 저장소 연결
3. 브랜치별 배포 설정:
   - `main`/`master` 브랜치 → 프로덕션 배포
   - 기타 브랜치 → 프리뷰 배포

### 배포 설정 파일

`vercel.json` 파일로 배포 설정을 관리할 수 있습니다:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["icn1"]
}
```

## 문제 해결

### 빌드 실패

1. 로컬에서 빌드 테스트:
   ```bash
   pnpm build
   ```

2. 빌드 로그 확인:
   ```bash
   vercel logs [deployment-url]
   ```

3. 환경 변수 확인:
   - 모든 필수 환경 변수가 설정되어 있는지 확인
   - 환경 변수 이름이 정확한지 확인 (대소문자 구분)

### 환경 변수 누락

환경 변수가 설정되지 않으면 빌드나 런타임 에러가 발생할 수 있습니다. Vercel Dashboard에서 환경 변수를 확인하세요.

### Clerk 리다이렉트 URL 설정

Clerk Dashboard에서 배포된 URL을 허용된 리다이렉트 URL로 추가해야 합니다:

1. [Clerk Dashboard](https://dashboard.clerk.com/) 접속
2. **User & Authentication** → **Email, Phone, Username**
3. **Redirect URLs** 섹션에 추가:
   - `https://your-project.vercel.app`
   - `https://your-project.vercel.app/sign-in`
   - `https://your-project.vercel.app/sign-up`

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel CLI 참조](https://vercel.com/docs/cli)

