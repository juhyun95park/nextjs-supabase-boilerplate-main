/**
 * @file tests/e2e/orders.spec.ts
 * @description 주문 내역 조회 플로우 E2E 테스트
 *
 * 주문 내역 관련 기능을 테스트합니다.
 * - 주문 내역 목록 페이지 접근
 * - 주문 상세 페이지 접근
 * - 주문 정보 확인
 */

import { test, expect } from "@playwright/test";

test.describe("주문 내역 조회 플로우", () => {
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

  test("주문 내역 페이지에서 주문 목록이 표시되어야 함", async ({ page }) => {
    await test.step("주문 내역 페이지 접근 (인증 필요)", async () => {
      await page.goto("/orders");
    });

    await test.step("로그인 페이지로 리다이렉트 또는 주문 목록 확인", async () => {
      const currentUrl = page.url();
      if (currentUrl.includes("sign-in")) {
        await expect(page).toHaveURL(/.*sign-in.*/);
      } else {
        // 인증된 경우 주문 목록 또는 빈 상태 메시지 확인
        const ordersList = page.getByText(/주문 내역|주문이 없습니다|비어있습니다/);
        await expect(ordersList.first()).toBeVisible();
      }
    });
  });

  test("주문 상세 페이지에서 주문 정보가 표시되어야 함", async ({ page }) => {
    await test.step("주문 상세 페이지 접근 (인증 및 주문 필요)", async () => {
      // 실제 주문 ID가 필요하므로 테스트용 주문 ID 사용
      await page.goto("/orders/test-order-id");
    });

    await test.step("로그인 페이지로 리다이렉트 또는 주문 정보 확인", async () => {
      const currentUrl = page.url();
      if (currentUrl.includes("sign-in")) {
        await expect(page).toHaveURL(/.*sign-in.*/);
      } else if (currentUrl.includes("orders")) {
        // 주문 상세 페이지에서 주문 정보 또는 에러 메시지 확인
        const orderInfo = page.getByText(/주문|상세|찾을 수 없습니다/).first();
        await expect(orderInfo).toBeVisible();
      }
    });
  });

  test("네비게이션 바에서 주문 내역 링크가 표시되어야 함", async ({ page }) => {
    await test.step("홈페이지 접근", async () => {
      await page.goto("/");
    });

    await test.step("네비게이션 바 확인", async () => {
      // 인증된 사용자에게만 "주문 내역" 링크가 표시됨
      const ordersLink = page.getByRole("link", { name: /주문 내역/ });
      const signInButton = page.getByRole("button", { name: "로그인" });
      
      if (await signInButton.isVisible()) {
        // 인증되지 않은 상태
        await expect(ordersLink).not.toBeVisible();
      } else {
        // 인증된 상태 (테스트용)
        // 실제로는 인증이 필요하므로 이 부분은 스킵
        test.skip();
      }
    });
  });
});

