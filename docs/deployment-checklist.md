# 배포 체크리스트

이 문서는 Vercel에 배포하기 전에 확인해야 할 사항들을 정리한 체크리스트입니다.

## 배포 전 체크리스트

### 1. 코드 준비

- [ ] 모든 기능이 정상 작동하는지 확인
- [ ] 린터 오류 수정 (`pnpm lint`)
- [ ] 로컬 빌드 성공 확인 (`pnpm build`)
- [ ] E2E 테스트 통과 확인 (`pnpm test:e2e`)
- [ ] 불필요한 콘솔 로그 제거
- [ ] 환경 변수 확인 (`.env.local` 파일)

### 2. 데이터베이스 준비

- [ ] Supabase 마이그레이션 실행 완료
- [ ] 테스트 데이터 확인 (필요한 경우)
- [ ] RLS 정책 확인 (프로덕션 환경)
- [ ] Storage 버킷 생성 및 권한 설정

### 3. 환경 변수 설정

#### Clerk
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 설정
- [ ] `CLERK_SECRET_KEY` 설정
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL` 설정
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` 설정
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` 설정

#### Supabase
- [ ] `NEXT_PUBLIC_SUPABASE_URL` 설정
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 설정
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 설정
- [ ] `NEXT_PUBLIC_STORAGE_BUCKET` 설정

#### Toss Payments (선택사항)
- [ ] `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` 설정
- [ ] `TOSS_PAYMENTS_SECRET_KEY` 설정

### 4. Clerk 설정

- [ ] Clerk Dashboard에서 배포 URL을 허용된 리다이렉트 URL로 추가
  - 프로덕션 URL: `https://your-project.vercel.app`
  - 프로덕션 로그인 URL: `https://your-project.vercel.app/sign-in`
  - 프로덕션 회원가입 URL: `https://your-project.vercel.app/sign-up`
- [ ] Clerk Dashboard에서 Supabase 통합 활성화 확인

### 5. Vercel 설정

- [ ] Vercel 프로젝트 생성 또는 연결
- [ ] Git 저장소 연결 (선택사항)
- [ ] 빌드 설정 확인 (`vercel.json`)
- [ ] 환경 변수 설정 확인
- [ ] 도메인 설정 (선택사항)

### 6. 빌드 및 배포

- [ ] 로컬 빌드 테스트 (`pnpm build`)
- [ ] 프리뷰 배포 테스트 (`vercel`)
- [ ] 프로덕션 배포 (`vercel --prod`)

## 배포 후 확인 사항

### 1. 기본 기능 확인

- [ ] 홈페이지 접근 가능
- [ ] 로그인/회원가입 작동
- [ ] 상품 목록 조회 가능
- [ ] 상품 상세 페이지 접근 가능
- [ ] 장바구니 기능 작동 (인증 필요)
- [ ] 주문 생성 가능 (인증 필요)
- [ ] 결제 플로우 작동 (테스트 모드)
- [ ] 주문 내역 조회 가능 (인증 필요)

### 2. 에러 확인

- [ ] 브라우저 콘솔 에러 확인
- [ ] Vercel 로그 확인 (`vercel logs`)
- [ ] Supabase 로그 확인
- [ ] Clerk 로그 확인

### 3. 성능 확인

- [ ] 페이지 로딩 속도 확인
- [ ] 이미지 최적화 확인
- [ ] API 응답 시간 확인

### 4. 보안 확인

- [ ] 환경 변수 노출 확인 (클라이언트 번들 검사)
- [ ] HTTPS 연결 확인
- [ ] 인증이 필요한 페이지 접근 제한 확인

## 문제 해결

### 빌드 실패

**증상**: Vercel 빌드가 실패함

**해결 방법**:
1. 로컬에서 빌드 테스트: `pnpm build`
2. 빌드 로그 확인: Vercel Dashboard → Deployments → 실패한 배포 → Build Logs
3. 환경 변수 확인: 모든 필수 환경 변수가 설정되어 있는지 확인
4. 의존성 확인: `package.json`의 모든 의존성이 올바른지 확인

### 환경 변수 오류

**증상**: 런타임 에러 또는 기능이 작동하지 않음

**해결 방법**:
1. Vercel Dashboard에서 환경 변수 확인
2. 환경 변수 이름 확인 (대소문자 구분)
3. 환경 변수 값 확인 (공백, 특수문자 등)
4. 서버 재시작 (환경 변수 변경 후)

### Clerk 리다이렉트 오류

**증상**: 로그인/회원가입 후 리다이렉트 실패

**해결 방법**:
1. Clerk Dashboard → User & Authentication → Redirect URLs 확인
2. 배포된 URL이 허용된 리다이렉트 URL 목록에 있는지 확인
3. 환경 변수 `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` 확인

### Supabase 연결 오류

**증상**: 데이터베이스 쿼리 실패

**해결 방법**:
1. Supabase 프로젝트 상태 확인
2. 환경 변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인
3. Supabase Dashboard → Logs에서 에러 확인
4. RLS 정책 확인 (프로덕션 환경)

### 결제 오류

**증상**: Toss Payments 위젯이 표시되지 않음

**해결 방법**:
1. 환경 변수 `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` 확인
2. Toss Payments 개발자센터에서 키 상태 확인
3. 테스트 모드/프로덕션 모드 확인

## 배포 명령어

```bash
# 프리뷰 배포
pnpm deploy:preview
# 또는
vercel

# 프로덕션 배포
pnpm deploy:prod
# 또는
vercel --prod

# 배포 상태 확인
vercel ls

# 배포 로그 확인
vercel logs [deployment-url]
```

## 추가 리소스

- [Vercel 배포 가이드](./vercel-deployment.md)
- [환경 변수 가이드](./environment-variables.md)
- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/app/building-your-application/deploying)

