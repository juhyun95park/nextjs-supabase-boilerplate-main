/**
 * @file playwright.config.ts
 * @description Playwright E2E 테스트 설정 파일
 *
 * Playwright 테스트 실행 환경을 설정합니다.
 */

import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  /* 테스트 실행 시 최대 병렬 실행 수 */
  fullyParallel: true,
  /* CI에서 실패한 테스트를 재실행할지 여부 */
  forbidOnly: !!process.env.CI,
  /* CI에서 실패 시 재시도 횟수 */
  retries: process.env.CI ? 2 : 0,
  /* CI에서 병렬 실행 수 */
  workers: process.env.CI ? 1 : undefined,
  /* 테스트 리포터 설정 */
  reporter: "html",
  /* 공유 설정 */
  use: {
    /* 기본 URL (로컬 개발 서버) */
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    /* 스크린샷 설정 */
    screenshot: "only-on-failure",
    /* 비디오 설정 */
    video: "retain-on-failure",
    /* 트레이스 설정 */
    trace: "on-first-retry",
  },

  /* 테스트 타임아웃 (30초) */
  timeout: 30000,

  /* 테스트할 프로젝트 (브라우저) */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // 필요시 다른 브라우저 추가
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],

  /* 개발 서버 실행 설정 */
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

