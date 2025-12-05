/**
 * @file components/ui/empty-state.tsx
 * @description 공통 빈 상태 컴포넌트
 *
 * 재사용 가능한 빈 상태 UI 컴포넌트를 제공합니다.
 * 다양한 상황에 맞는 메시지와 액션 버튼을 지원합니다.
 */

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * 빈 상태 컴포넌트 Props
 */
interface EmptyStateProps {
  /** 아이콘 (ReactNode) */
  icon?: ReactNode;
  /** 제목 */
  title: string;
  /** 설명 */
  description?: string;
  /** 액션 버튼 텍스트 */
  actionLabel?: string;
  /** 액션 버튼 링크 */
  actionHref?: string;
  /** 액션 버튼 핸들러 */
  actionOnClick?: () => void;
  /** 추가 클래스명 */
  className?: string;
}

/**
 * 빈 상태 컴포넌트
 *
 * 데이터가 없을 때 표시하는 공통 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<PackageX className="h-12 w-12" />}
 *   title="장바구니가 비어있습니다"
 *   description="상품을 추가해보세요"
 *   actionLabel="상품 보러가기"
 *   actionHref="/products"
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  className,
}: EmptyStateProps) {
  const ActionButton = () => {
    if (!actionLabel) return null;

    const buttonContent = (
      <Button size="lg" onClick={actionOnClick}>
        {actionLabel}
      </Button>
    );

    if (actionHref) {
      return <Link href={actionHref}>{buttonContent}</Link>;
    }

    return buttonContent;
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      {icon && <div className="mb-6">{icon}</div>}
      <h2 className="mb-3 text-2xl font-bold">{title}</h2>
      {description && (
        <p className="mb-8 max-w-md text-muted-foreground">{description}</p>
      )}
      {actionLabel && (
        <div className="flex justify-center">
          <ActionButton />
        </div>
      )}
    </div>
  );
}

