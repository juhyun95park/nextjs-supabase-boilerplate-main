# 데이터베이스 설정 가이드

이 문서는 Supabase 데이터베이스 스키마를 설정하는 방법을 안내합니다.

## 문제 해결

만약 "products 테이블이 존재하지 않습니다" 또는 "relation 'products' does not exist" 에러가 발생한다면, 다음 단계를 따라 데이터베이스 스키마를 설정하세요.

## 방법 1: Supabase Dashboard에서 SQL 실행 (권장)

1. [Supabase Dashboard](https://app.supabase.com)에 로그인합니다.
2. 프로젝트를 선택합니다.
3. 왼쪽 사이드바에서 **SQL Editor**를 클릭합니다.
4. **New query** 버튼을 클릭합니다.
5. `supabase/migrations/db.sql` 파일의 내용을 복사하여 붙여넣습니다.
6. **Run** 버튼을 클릭하여 실행합니다.

## 방법 2: Supabase CLI 사용

로컬에 Supabase CLI가 설치되어 있다면:

```bash
# Supabase 프로젝트 연결 (처음 한 번만)
supabase link --project-ref <your-project-ref>

# 마이그레이션 적용
supabase db push
```

## 방법 3: 개별 테이블 생성

특정 테이블만 생성하려면 SQL Editor에서 다음 쿼리를 실행하세요:

### products 테이블만 생성

```sql
-- 상품 테이블 생성
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category TEXT,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS 비활성화
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
```

## 생성되는 테이블

다음 테이블들이 생성됩니다:

1. **products** - 상품 정보
2. **cart_items** - 장바구니 항목
3. **orders** - 주문 정보
4. **order_items** - 주문 상세 항목

## 샘플 데이터

`db.sql` 파일에는 20개의 샘플 상품 데이터가 포함되어 있습니다. 마이그레이션을 실행하면 자동으로 샘플 데이터가 추가됩니다.

## 확인 방법

마이그레이션이 성공적으로 적용되었는지 확인하려면:

1. Supabase Dashboard → **Table Editor**로 이동
2. `products` 테이블이 표시되는지 확인
3. 샘플 데이터가 20개 있는지 확인

## 문제 해결

### "permission denied" 에러

테이블 소유자 권한 문제일 수 있습니다. 다음 쿼리를 실행하세요:

```sql
ALTER TABLE public.products OWNER TO postgres;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
```

### "relation already exists" 에러

테이블이 이미 존재하는 경우입니다. `CREATE TABLE IF NOT EXISTS` 구문을 사용했으므로 무시해도 됩니다.

### 마이그레이션 롤백

마이그레이션을 롤백하려면:

```sql
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
```

**주의**: 이 작업은 모든 데이터를 삭제합니다. 프로덕션 환경에서는 사용하지 마세요.

## 추가 리소스

- [Supabase SQL Editor 가이드](https://supabase.com/docs/guides/database/overview)
- [Supabase CLI 가이드](https://supabase.com/docs/guides/cli)

