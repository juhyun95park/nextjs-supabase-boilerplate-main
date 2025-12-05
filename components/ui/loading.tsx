/**
 * @file components/ui/loading.tsx
 * @description 공통 로딩 컴포넌트
 *
 * 재사용 가능한 로딩 상태 UI 컴포넌트들을 제공합니다.
 * 스피너, 스켈레톤 UI 등을 포함합니다.
 */

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 스피너 컴포넌트
 */
interface SpinnerProps {
  /** 스피너 크기 (기본값: "md") */
  size?: "sm" | "md" | "lg";
  /** 추가 클래스명 */
  className?: string;
  /** 텍스트 표시 여부 */
  text?: string;
}

export function Spinner({ size = "md", className, text }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

/**
 * 페이지 로딩 컴포넌트
 * 전체 페이지 로딩 상태에 사용됩니다.
 */
interface PageLoadingProps {
  /** 로딩 메시지 */
  message?: string;
}

export function PageLoading({ message = "로딩 중..." }: PageLoadingProps) {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <Spinner size="lg" />
        <p className="text-lg font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

/**
 * 스켈레톤 컴포넌트
 * 콘텐츠 로딩 중 플레이스홀더로 사용됩니다.
 */
interface SkeletonProps {
  /** 스켈레톤 높이 (기본값: "h-4") */
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className || "h-4 w-full"
      )}
    />
  );
}

/**
 * 상품 카드 스켈레톤
 * 상품 목록 로딩 시 사용됩니다.
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <Skeleton className="aspect-square w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    </div>
  );
}

/**
 * 테이블 행 스켈레톤
 * 테이블 로딩 시 사용됩니다.
 */
interface TableRowSkeletonProps {
  /** 컬럼 개수 */
  columns?: number;
}

export function TableRowSkeleton({ columns = 4 }: TableRowSkeletonProps) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

