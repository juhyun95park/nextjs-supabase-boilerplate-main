/**
 * @file tests/fixtures/users.ts
 * @description 테스트용 사용자 데이터
 *
 * E2E 테스트에서 사용할 테스트 사용자 정보를 정의합니다.
 * 실제 테스트 환경에서는 테스트용 Clerk 계정을 사용해야 합니다.
 */

export const TEST_USERS = {
  valid: {
    email: "test@example.com",
    password: "TestPassword123!",
  },
  invalid: {
    email: "invalid@example.com",
    password: "wrongpassword",
  },
} as const;

