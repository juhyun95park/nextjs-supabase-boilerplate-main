# 운영 가이드

이 문서는 프로덕션 환경에서 애플리케이션을 운영하기 위한 가이드를 제공합니다.

## 목차

1. [환경 변수 관리](#환경-변수-관리)
2. [데이터베이스 관리](#데이터베이스-관리)
3. [모니터링 및 로깅](#모니터링-및-로깅)
4. [문제 해결](#문제-해결)

## 환경 변수 관리

### 필수 환경 변수

프로덕션 환경에서 다음 환경 변수들이 설정되어 있어야 합니다:

#### Clerk 인증

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

**주의사항:**
- 프로덕션에서는 `pk_live_` 및 `sk_live_`로 시작하는 라이브 키를 사용해야 합니다
- 테스트 키(`pk_test_`, `sk_test_`)는 개발 환경에서만 사용하세요

#### Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STORAGE_BUCKET=uploads
```

**주의사항:**
- `SUPABASE_SERVICE_ROLE_KEY`는 절대 공개하지 마세요
- 이 키는 모든 RLS를 우회하는 관리자 권한입니다
- 클라이언트 코드에서 사용하지 마세요

#### Toss Payments

```env
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_ck_...
```

**주의사항:**
- 프로덕션에서는 라이브 키를 사용해야 합니다
- 테스트 키는 개발/테스트 환경에서만 사용하세요

### Vercel 환경 변수 설정

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 각 환경(Production, Preview, Development)에 변수 추가
4. **Save** 클릭

**환경별 설정:**
- **Production**: 프로덕션 라이브 키 사용
- **Preview**: 테스트 키 사용 가능
- **Development**: 로컬 개발용 테스트 키

## 데이터베이스 관리

### 데이터베이스 백업

Supabase는 자동 백업을 제공하지만, 수동 백업도 가능합니다:

1. Supabase Dashboard → **Database** → **Backups**
2. **Create backup** 클릭
3. 백업 이름 입력 후 생성

### 마이그레이션 관리

**새 마이그레이션 적용:**

1. Supabase Dashboard → **SQL Editor**
2. 마이그레이션 파일 내용 복사
3. **Run** 클릭하여 실행

**마이그레이션 롤백:**

필요한 경우 이전 마이그레이션으로 롤백할 수 있습니다:

```sql
-- 예시: 특정 테이블 삭제
DROP TABLE IF EXISTS table_name CASCADE;
```

### 데이터베이스 모니터링

**Supabase Dashboard에서 확인 가능한 지표:**

- **Database**: 쿼리 성능, 연결 수, 저장 공간 사용량
- **API**: 요청 수, 응답 시간, 에러율
- **Auth**: 사용자 수, 로그인 수
- **Storage**: 파일 업로드/다운로드, 저장 공간

### 성능 최적화

**인덱스 확인:**

```sql
-- 인덱스 목록 확인
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

**쿼리 성능 분석:**

```sql
-- 느린 쿼리 확인 (PostgreSQL 13+)
SELECT
  query,
  calls,
  total_exec_time,
  mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

## 모니터링 및 로깅

### Vercel 로그 확인

1. Vercel Dashboard → 프로젝트 선택
2. **Deployments** → 특정 배포 클릭
3. **Functions** 탭에서 서버 로그 확인

### Supabase 로그 확인

1. Supabase Dashboard → **Logs**
2. 서비스별 로그 확인:
   - **API**: REST API 요청/응답
   - **Postgres**: 데이터베이스 쿼리
   - **Auth**: 인증 관련 이벤트
   - **Storage**: 파일 업로드/다운로드

### 에러 모니터링

**클라이언트 사이드 에러:**

- 브라우저 콘솔에서 확인
- React Error Boundary로 포착된 에러는 서버 로그에 기록

**서버 사이드 에러:**

- Vercel Functions 로그에서 확인
- Server Actions의 `console.error` 출력 확인

### 성능 모니터링

**Vercel Analytics:**

1. Vercel Dashboard → 프로젝트 → **Analytics**
2. 페이지 뷰, 성능 지표 확인

**Core Web Vitals:**

- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

## 문제 해결

### 일반적인 문제

#### 1. 환경 변수 누락

**증상:**
- 빌드 실패
- 런타임 에러: "Missing environment variable"

**해결 방법:**
1. `.env.local` 파일 확인 (로컬 개발)
2. Vercel Dashboard에서 환경 변수 확인 (프로덕션)
3. 모든 필수 환경 변수가 설정되어 있는지 확인

#### 2. Supabase 연결 실패

**증상:**
- "Failed to fetch" 에러
- 데이터 조회 실패

**해결 방법:**
1. `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인
2. Supabase Dashboard에서 프로젝트 상태 확인
3. 네트워크 연결 확인

#### 3. Clerk 인증 실패

**증상:**
- 로그인 실패
- "Unauthorized" 에러

**해결 방법:**
1. Clerk Dashboard에서 API 키 확인
2. Clerk + Supabase 통합 상태 확인
3. Supabase Dashboard → Authentication → Providers에서 Clerk 설정 확인

#### 4. 결제 위젯 로드 실패

**증상:**
- 결제 페이지에서 위젯이 표시되지 않음
- "Payment widget failed to load" 에러

**해결 방법:**
1. `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` 확인
2. Toss Payments Dashboard에서 키 상태 확인
3. 네트워크 탭에서 외부 리소스 로드 확인

### 데이터베이스 문제

#### 테이블이 존재하지 않음

**증상:**
- "relation does not exist" 에러
- 데이터 조회 실패

**해결 방법:**
1. Supabase Dashboard → SQL Editor
2. `supabase/migrations/db.sql` 파일 내용 실행
3. 테이블 생성 확인

#### RLS 정책 문제

**증상:**
- "permission denied" 에러
- 데이터 접근 실패

**해결 방법:**
1. 개발 환경에서는 RLS가 비활성화되어 있어야 함
2. RLS 상태 확인:
   ```sql
   SELECT tablename, rowsecurity
   FROM pg_tables
   WHERE schemaname = 'public';
   ```
3. 필요시 RLS 비활성화:
   ```sql
   ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
   ```

### 성능 문제

#### 느린 페이지 로드

**해결 방법:**
1. 이미지 최적화 확인
2. 불필요한 데이터베이스 쿼리 확인
3. Vercel Analytics에서 성능 지표 확인
4. 코드 스플리팅 확인

#### 데이터베이스 쿼리 성능

**해결 방법:**
1. 인덱스 추가:
   ```sql
   CREATE INDEX idx_table_column ON table_name(column_name);
   ```
2. 쿼리 최적화 (불필요한 JOIN 제거)
3. 페이지네이션 적용

### 배포 문제

#### 빌드 실패

**해결 방법:**
1. 로컬에서 빌드 테스트:
   ```bash
   pnpm build
   ```
2. 빌드 로그에서 에러 확인
3. TypeScript 타입 에러 확인
4. 환경 변수 누락 확인

#### 배포 후 기능 동작 안 함

**해결 방법:**
1. 환경 변수 설정 확인 (Vercel Dashboard)
2. 브라우저 콘솔에서 에러 확인
3. Vercel Functions 로그 확인
4. Supabase 로그 확인

## 유지보수 체크리스트

### 일일 체크

- [ ] 애플리케이션 정상 동작 확인
- [ ] 에러 로그 확인
- [ ] 주요 기능 테스트

### 주간 체크

- [ ] 데이터베이스 백업 확인
- [ ] 성능 지표 확인
- [ ] 사용자 피드백 검토
- [ ] 보안 업데이트 확인

### 월간 체크

- [ ] 의존성 업데이트
- [ ] 데이터베이스 최적화
- [ ] 로그 정리
- [ ] 비용 모니터링

## 지원 및 문의

문제가 발생하거나 도움이 필요한 경우:

1. 프로젝트 이슈 트래커 확인
2. 관련 문서 확인:
   - [README.md](../README.md)
   - [개발 가이드](development-guide.md)
   - [배포 가이드](vercel-deployment.md)
3. 기술 지원 팀에 문의

