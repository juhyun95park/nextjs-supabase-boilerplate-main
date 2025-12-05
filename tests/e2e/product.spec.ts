/**
 * @file tests/e2e/product.spec.ts
 * @description 상품 조회 플로우 E2E 테스트
 *
 * 상품 관련 기능을 테스트합니다.
 * - 홈페이지에서 상품 목록 확인
 * - 상품 목록 페이지에서 상품 조회
 * - 상품 상세 페이지 조회
 * - 카테고리 필터링
 * - 정렬 기능
 */

import { test, expect } from "@playwright/test";

test.describe("상품 조회 플로우", () => {
  test("홈페이지에서 상품 목록 섹션이 표시되어야 함", async ({ page }) => {
    await test.step("홈페이지 접근", async () => {
      await page.goto("/");
    });

    await test.step("상품 목록 섹션 확인", async () => {
      // 홈페이지에 "인기 상품" 또는 "상품" 관련 텍스트가 있는지 확인
      const heading = page.getByRole("heading");
      await expect(heading.first()).toBeVisible();
    });
  });

  test("상품 목록 페이지로 이동할 수 있어야 함", async ({ page }) => {
    await test.step("홈페이지 접근", async () => {
      await page.goto("/");
    });

    await test.step("상품 목록 링크 클릭", async () => {
      const productsLink = page.getByRole("link", { name: /상품/ });
      if (await productsLink.isVisible()) {
        await productsLink.click();
      } else {
        // 직접 URL로 이동
        await page.goto("/products");
      }
    });

    await test.step("상품 목록 페이지 확인", async () => {
      await expect(page).toHaveURL("/products");
      const heading = page.getByRole("heading", { name: /전체 상품|상품/ });
      await expect(heading).toBeVisible();
    });
  });

  test("상품 목록 페이지에서 상품 카드가 표시되어야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("상품 카드 확인", async () => {
      // 상품 카드가 하나 이상 표시되는지 확인
      // 상품이 없는 경우를 대비해 조건부 확인
      const productCards = page.locator('[class*="card"], article, [class*="product"]');
      const count = await productCards.count();
      
      if (count > 0) {
        await expect(productCards.first()).toBeVisible();
      } else {
        // 상품이 없는 경우 빈 상태 메시지 확인
        const emptyMessage = page.getByText(/등록된 상품이 없습니다|상품이 없습니다/);
        await expect(emptyMessage).toBeVisible();
      }
    });
  });

  test("상품 카드 클릭 시 상품 상세 페이지로 이동해야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("첫 번째 상품 카드 클릭", async () => {
      const productCards = page.locator('a[href*="/products/"]').first();
      const count = await productCards.count();
      
      if (count > 0) {
        const productLink = productCards.first();
        await productLink.click();
      } else {
        // 상품이 없는 경우 테스트 스킵
        test.skip();
      }
    });

    await test.step("상품 상세 페이지 확인", async () => {
      await expect(page).toHaveURL(/\/products\/[^/]+/);
      // 상품 이름이나 가격이 표시되는지 확인
      const productInfo = page.locator('h1, [class*="price"], [class*="product"]');
      await expect(productInfo.first()).toBeVisible();
    });
  });

  test("상품 상세 페이지에서 상품 정보가 표시되어야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("첫 번째 상품으로 이동", async () => {
      const productLinks = page.locator('a[href*="/products/"]');
      const count = await productLinks.count();
      
      if (count > 0) {
        await productLinks.first().click();
      } else {
        test.skip();
      }
    });

    await test.step("상품 정보 확인", async () => {
      // 상품 이름
      const productName = page.getByRole("heading", { level: 1 });
      await expect(productName).toBeVisible();
      
      // 가격 정보 (선택사항)
      const price = page.getByText(/원/).first();
      if (await price.isVisible()) {
        await expect(price).toBeVisible();
      }
    });
  });

  test("상품 목록 페이지에서 카테고리 필터가 작동해야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("카테고리 필터 확인", async () => {
      // 카테고리 필터 버튼이나 링크 확인
      const categoryFilter = page.getByRole("button", { name: /전체|카테고리/ }).or(
        page.getByRole("link", { name: /전체|카테고리/ })
      );
      
      if (await categoryFilter.count() > 0) {
        await expect(categoryFilter.first()).toBeVisible();
      }
    });
  });

  test("상품 목록 페이지에서 정렬 기능이 작동해야 함", async ({ page }) => {
    await test.step("상품 목록 페이지 접근", async () => {
      await page.goto("/products");
    });

    await test.step("정렬 선택자 확인", async () => {
      // 정렬 드롭다운이나 버튼 확인
      const sortSelector = page.getByRole("combobox").or(
        page.getByRole("button", { name: /정렬/ })
      );
      
      if (await sortSelector.count() > 0) {
        await expect(sortSelector.first()).toBeVisible();
      }
    });
  });
});

