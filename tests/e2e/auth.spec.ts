/**
 * @file tests/e2e/auth.spec.ts
 * @description 인증 플로우 E2E 테스트
 *
 * 사용자 인증 관련 기능을 테스트합니다.
 * - 로그인 버튼 표시 확인
 * - 인증이 필요한 페이지 접근 시 리다이렉트 확인
 * - 로그인 후 인증된 상태 확인
 */

import { test, expect } from "@playwright/test";

test.describe("인증 플로우", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("홈페이지에서 로그인 버튼이 표시되어야 함", async ({ page }) => {
    await test.step("로그인 버튼 확인", async () => {
      const signInButton = page.getByRole("button", { name: "로그인" });
      await expect(signInButton).toBeVisible();
    });
  });

  test("로그인 버튼 클릭 시 Clerk 모달이 열려야 함", async ({ page }) => {
    await test.step("로그인 버튼 클릭", async () => {
      const signInButton = page.getByRole("button", { name: "로그인" });
      await signInButton.click();
    });

    await test.step("Clerk 모달 확인", async () => {
      // Clerk 모달이 열리는지 확인 (Clerk의 클래스명 사용)
      const clerkModal = page.locator('[class*="clerk"]').first();
      await expect(clerkModal).toBeVisible({ timeout: 5000 });
    });
  });

  test("인증되지 않은 사용자가 장바구니 페이지 접근 시 로그인 페이지로 리다이렉트", async ({
    page,
  }) => {
    await test.step("장바구니 페이지 접근", async () => {
      await page.goto("/cart");
    });

    await test.step("로그인 페이지로 리다이렉트 확인", async () => {
      // Clerk의 sign-in 페이지로 리다이렉트되는지 확인
      await expect(page).toHaveURL(/.*sign-in.*/, { timeout: 5000 });
    });
  });

  test("인증되지 않은 사용자가 주문 내역 페이지 접근 시 로그인 페이지로 리다이렉트", async ({
    page,
  }) => {
    await test.step("주문 내역 페이지 접근", async () => {
      await page.goto("/orders");
    });

    await test.step("로그인 페이지로 리다이렉트 확인", async () => {
      await expect(page).toHaveURL(/.*sign-in.*/, { timeout: 5000 });
    });
  });

  test("인증되지 않은 사용자가 체크아웃 페이지 접근 시 로그인 페이지로 리다이렉트", async ({
    page,
  }) => {
    await test.step("체크아웃 페이지 접근", async () => {
      await page.goto("/checkout");
    });

    await test.step("로그인 페이지로 리다이렉트 확인", async () => {
      await expect(page).toHaveURL(/.*sign-in.*/, { timeout: 5000 });
    });
  });

  test("공개 페이지는 인증 없이 접근 가능해야 함", async ({ page }) => {
    await test.step("홈페이지 접근", async () => {
      await page.goto("/");
      await expect(page).toHaveURL("/");
    });

    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
      await expect(page).toHaveURL("/products");
    });
  });
});

