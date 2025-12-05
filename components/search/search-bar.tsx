/**
 * @file components/search/search-bar.tsx
 * @description 검색 바 컴포넌트
 *
 * legodt.kr 스타일의 검색 기능을 제공합니다.
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

/**
 * 검색 바 내부 컴포넌트 (useSearchParams 사용)
 */
function SearchBarInner({
  className,
  placeholder = "검색어를 입력하세요",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (searchParams.get("search")) {
      router.push("/products");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn("relative flex w-full max-w-md items-center", className)}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10"
          aria-label="상품 검색"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 h-7 w-7"
            onClick={handleClear}
            aria-label="검색어 지우기"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" className="ml-2" aria-label="검색">
        검색
      </Button>
    </form>
  );
}

/**
 * 검색 바 컴포넌트 (Suspense로 감싸서 useSearchParams 사용)
 */
export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={
      <div className={cn("relative flex w-full max-w-md items-center", props.className)}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={props.placeholder}
            className="w-full pl-10 pr-10"
            disabled
          />
        </div>
        <Button className="ml-2" disabled>검색</Button>
      </div>
    }>
      <SearchBarInner {...props} />
    </Suspense>
  );
}

