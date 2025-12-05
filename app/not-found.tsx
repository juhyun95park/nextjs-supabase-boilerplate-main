/**
 * @file app/not-found.tsx
 * @description 404 페이지
 *
 * Next.js 15 App Router 방식으로 404 페이지를 구현합니다.
 * 존재하지 않는 페이지에 접근할 때 표시됩니다.
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

/**
 * 404 페이지
 */
export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6">
          <h1 className="mb-2 text-6xl font-bold text-primary">404</h1>
          <h2 className="mb-4 text-2xl font-semibold">페이지를 찾을 수 없습니다</h2>
          <p className="mb-8 text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            <br />
            URL을 확인하시거나 홈으로 돌아가주세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              상품 보기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

