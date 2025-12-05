# Toss Payments 설정 가이드

이 문서는 Toss Payments 테스트 모드를 프로젝트에 설정하는 방법을 안내합니다.

## 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# Toss Payments (테스트 모드)
NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY=test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm
```

## 테스트 키

현재 프로젝트는 Toss Payments의 테스트 모드를 사용합니다.

### 테스트 클라이언트 키
```
test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm
```

이 키는 Toss Payments 문서에서 제공하는 테스트용 키입니다. 실제 결제가 발생하지 않으며, 테스트 목적으로만 사용됩니다.

## 프로덕션 설정

프로덕션 환경에서는 다음 단계를 따라야 합니다:

1. [Toss Payments 개발자 센터](https://developers.tosspayments.com/)에 가입
2. 프로젝트 생성 및 클라이언트 키 발급
3. Vercel Dashboard에서 환경 변수 설정:
   - `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`: 발급받은 클라이언트 키

## 결제 흐름

1. **주문 생성** (`/checkout`)
   - 사용자가 주문 정보를 입력하고 주문을 생성
   - 주문 상태: `pending`

2. **결제 페이지** (`/payment/[orderId]`)
   - Toss Payments 위젯이 표시됨
   - 사용자가 결제 수단을 선택하고 결제 진행

3. **결제 성공** (`/payment/success`)
   - Toss Payments에서 리다이렉트
   - 주문 상태가 `pending` → `confirmed`로 업데이트
   - 주문 상세 페이지로 이동 (Phase 5에서 구현 예정)

4. **결제 실패** (`/payment/fail`)
   - Toss Payments에서 리다이렉트
   - 주문 상태가 `pending` → `cancelled`로 업데이트
   - 다시 결제하거나 장바구니로 돌아가기

## 테스트 결제 방법

Toss Payments 테스트 모드에서는 다음 테스트 카드 번호를 사용할 수 있습니다:

- **카드 번호**: `1234-5678-9012-3456`
- **유효기간**: 미래 날짜 (예: `12/25`)
- **CVC**: 임의의 3자리 숫자 (예: `123`)
- **비밀번호**: 임의의 2자리 숫자 (예: `12`)

## 문제 해결

### "결제 서비스 설정이 완료되지 않았습니다" 에러

- `.env.local` 파일에 `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY`가 설정되어 있는지 확인
- 개발 서버를 재시작 (`pnpm dev`)

### 결제 위젯이 로드되지 않는 경우

- 브라우저 콘솔에서 에러 메시지 확인
- 네트워크 탭에서 Toss Payments SDK 로드 여부 확인
- 클라이언트 키가 올바른지 확인

## 추가 리소스

- [Toss Payments 공식 문서](https://docs.tosspayments.com/)
- [Toss Payments 위젯 통합 가이드](https://docs.tosspayments.com/en/integration-widget)

