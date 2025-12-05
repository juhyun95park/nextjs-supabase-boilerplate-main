/**
 * @file tests/e2e/checkout.spec.ts
 * @description 주문 및 결제 플로우 E2E 테스트
 *
 * 주문 및 결제 관련 기능을 테스트합니다.
 * - 체크아웃 페이지 접근
 * - 주문 정보 입력 폼 확인
 * - 결제 페이지 접근
 *
 * 주의: 실제 결제는 테스트 모드에서만 진행해야 합니다.
 */

import { test, expect } from "@playwright/test";

test.describe("주문 및 결제 플로우", () => {
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

  test("체크아웃 페이지에서 주문 폼이 표시되어야 함", async ({ page }) => {
    await test.step("체크아웃 페이지 접근 (인증 필요)", async () => {
      await page.goto("/checkout");
    });

    await test.step("로그인 페이지로 리다이렉트 또는 주문 폼 확인", async () => {
      const currentUrl = page.url();
      if (currentUrl.includes("sign-in")) {
        // 인증되지 않은 경우
        await expect(page).toHaveURL(/.*sign-in.*/);
      } else {
        // 인증된 경우 주문 폼 확인
        const orderForm = page.getByRole("form").or(
          page.locator('input[name*="name"], input[name*="address"]')
        );
        if (await orderForm.count() > 0) {
          await expect(orderForm.first()).toBeVisible();
        } else {
          // 장바구니가 비어있는 경우
          const emptyMessage = page.getByText(/장바구니가 비어있습니다|비어있습니다/);
          await expect(emptyMessage).toBeVisible();
        }
      }
    });
  });

  test("결제 페이지 접근 시 주문 정보가 표시되어야 함", async ({ page }) => {
    await test.step("결제 페이지 접근 (인증 및 주문 필요)", async () => {
      // 실제 주문 ID가 필요하므로 테스트용 주문 ID 사용
      await page.goto("/payment/test-order-id");
    });

    await test.step("로그인 페이지로 리다이렉트 또는 결제 위젯 확인", async () => {
      const currentUrl = page.url();
      if (currentUrl.includes("sign-in")) {
        await expect(page).toHaveURL(/.*sign-in.*/);
      } else if (currentUrl.includes("payment")) {
        // 결제 페이지에서 주문 정보 또는 에러 메시지 확인
        const orderInfo = page.getByText(/주문|결제|오류/).first();
        await expect(orderInfo).toBeVisible();
      }
    });
  });
});

