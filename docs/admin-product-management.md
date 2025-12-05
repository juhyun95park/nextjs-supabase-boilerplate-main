# 어드민 상품 관리 가이드

이 문서는 Supabase Dashboard를 통해 상품을 등록하고 관리하는 방법을 안내합니다.

## 목차

1. [Supabase Dashboard 접근](#supabase-dashboard-접근)
2. [상품 등록 방법](#상품-등록-방법)
3. [필수 필드 및 데이터 형식](#필수-필드-및-데이터-형식)
4. [샘플 데이터 예시](#샘플-데이터-예시)
5. [상품 수정 및 삭제](#상품-수정-및-삭제)

## Supabase Dashboard 접근

1. [Supabase Dashboard](https://app.supabase.com)에 로그인합니다.
2. 프로젝트를 선택합니다.
3. 왼쪽 사이드바에서 **Table Editor**를 클릭합니다.
4. `products` 테이블을 선택합니다.

## 상품 등록 방법

### 방법 1: Table Editor에서 직접 추가

1. `products` 테이블에서 **Insert row** 버튼을 클릭합니다.
2. 필수 필드를 입력합니다 (아래 필드 설명 참조).
3. **Save** 버튼을 클릭하여 저장합니다.

### 방법 2: SQL Editor에서 INSERT 쿼리 실행

1. 왼쪽 사이드바에서 **SQL Editor**를 클릭합니다.
2. 아래 샘플 INSERT 쿼리를 참고하여 작성합니다.
3. **Run** 버튼을 클릭하여 실행합니다.

## 필수 필드 및 데이터 형식

### 필수 필드

| 필드명 | 타입 | 설명 | 필수 여부 |
|--------|------|------|-----------|
| `id` | UUID | 상품 고유 ID | 자동 생성 (기본값: `gen_random_uuid()`) |
| `name` | TEXT | 상품명 | 필수 |
| `price` | DECIMAL(10, 2) | 가격 (원) | 필수 |
| `stock_quantity` | INTEGER | 재고 수량 | 필수 (기본값: 0) |
| `is_active` | BOOLEAN | 활성화 여부 | 필수 (기본값: true) |
| `created_at` | TIMESTAMPTZ | 생성 일시 | 자동 생성 (기본값: `now()`) |
| `updated_at` | TIMESTAMPTZ | 수정 일시 | 자동 생성 (기본값: `now()`) |

### 선택 필드

| 필드명 | 타입 | 설명 |
|--------|------|------|
| `description` | TEXT | 상품 설명 |
| `category` | TEXT | 카테고리 (아래 카테고리 목록 참조) |

### 카테고리 목록

다음 카테고리 중 하나를 선택하거나 `NULL`로 설정할 수 있습니다:

- `electronics` - 전자제품
- `clothing` - 의류
- `books` - 도서
- `food` - 식품
- `sports` - 스포츠
- `beauty` - 뷰티
- `home` - 생활용품

## 샘플 데이터 예시

### SQL INSERT 쿼리 예시

```sql
-- 단일 상품 등록
INSERT INTO products (name, description, price, category, stock_quantity, is_active)
VALUES (
  '아이폰 15 Pro',
  '최신 A17 Pro 칩셋과 티타늄 디자인이 적용된 프리미엄 스마트폰입니다.',
  1590000,
  'electronics',
  50,
  true
);

-- 여러 상품 한 번에 등록
INSERT INTO products (name, description, price, category, stock_quantity, is_active)
VALUES
  (
    '나이키 에어맥스 270',
    '편안한 착화감과 스타일을 겸비한 운동화입니다.',
    139000,
    'sports',
    30,
    true
  ),
  (
    '해리포터 전집',
    'J.K. 롤링의 대표작 해리포터 시리즈 전 7권 세트입니다.',
    89000,
    'books',
    20,
    true
  ),
  (
    '오리지널 티셔츠',
    '100% 면 소재로 제작된 기본 티셔츠입니다.',
    29000,
    'clothing',
    100,
    true
  );
```

### Table Editor 입력 예시

**상품 1:**
- Name: `아이폰 15 Pro`
- Description: `최신 A17 Pro 칩셋과 티타늄 디자인이 적용된 프리미엄 스마트폰입니다.`
- Price: `1590000`
- Category: `electronics`
- Stock Quantity: `50`
- Is Active: `true` (체크박스 선택)

**상품 2:**
- Name: `나이키 에어맥스 270`
- Description: `편안한 착화감과 스타일을 겸비한 운동화입니다.`
- Price: `139000`
- Category: `sports`
- Stock Quantity: `30`
- Is Active: `true` (체크박스 선택)

## 상품 수정 및 삭제

### 상품 수정

1. Table Editor에서 수정할 상품 행을 클릭합니다.
2. 수정할 필드를 변경합니다.
3. **Save** 버튼을 클릭하여 저장합니다.

**참고:** `updated_at` 필드는 자동으로 현재 시간으로 업데이트됩니다.

### 상품 삭제

1. Table Editor에서 삭제할 상품 행을 선택합니다.
2. **Delete** 버튼을 클릭합니다.
3. 확인 대화상자에서 **Confirm**을 클릭합니다.

**주의:** 상품을 삭제하는 대신 `is_active`를 `false`로 설정하여 비활성화하는 것을 권장합니다. 이렇게 하면 주문 내역과의 연관성을 유지할 수 있습니다.

### 상품 비활성화 (권장)

판매를 중지하되 데이터는 유지하려면:

1. Table Editor에서 해당 상품 행을 클릭합니다.
2. `is_active` 필드를 `false`로 변경합니다.
3. **Save** 버튼을 클릭합니다.

비활성화된 상품은 상품 목록 페이지에 표시되지 않지만, 상품 상세 페이지에 직접 접근하면 "판매 중지된 상품입니다" 메시지가 표시됩니다.

## 주의사항

1. **가격 형식**: 가격은 정수로 입력합니다 (예: `1590000` = 1,590,000원).
2. **재고 관리**: 재고 수량이 0이면 상품 상세 페이지에서 "품절"로 표시됩니다.
3. **카테고리**: 카테고리는 대소문자를 구분합니다. 정확한 카테고리명을 사용하세요.
4. **이미지**: 현재는 이미지 필드가 없습니다. 향후 `image_url` 필드가 추가되면 Supabase Storage에 이미지를 업로드하고 URL을 입력할 수 있습니다.

## 문제 해결

### 상품이 목록에 표시되지 않는 경우

1. `is_active`가 `true`인지 확인합니다.
2. 브라우저 캐시를 지웁니다.
3. Supabase Dashboard에서 데이터가 올바르게 저장되었는지 확인합니다.

### 가격이 올바르게 표시되지 않는 경우

1. `price` 필드가 숫자 형식인지 확인합니다 (문자열이 아닌).
2. 소수점이 있는 경우 `DECIMAL(10, 2)` 형식에 맞는지 확인합니다.

## 추가 리소스

- [Supabase Table Editor 가이드](https://supabase.com/docs/guides/database/tables)
- [Supabase SQL Editor 가이드](https://supabase.com/docs/guides/database/overview)

