/**
 * @file components/ui/error-boundary.tsx
 * @description React Error Boundary 컴포넌트
 *
 * 애플리케이션의 예상치 못한 에러를 포착하고 사용자 친화적인 에러 메시지를 표시합니다.
 */

"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary 컴포넌트
 *
 * 자식 컴포넌트에서 발생한 에러를 포착하고 에러 UI를 표시합니다.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // 커스텀 에러 핸들러 호출
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있으면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 에러 UI
      return (
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="mb-2 text-2xl font-bold">문제가 발생했습니다</h2>
            <p className="mb-6 text-muted-foreground">
              예상치 못한 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-4 rounded-lg border bg-muted p-4 text-left">
                <summary className="cursor-pointer font-medium">
                  에러 상세 정보 (개발 모드)
                </summary>
                <pre className="mt-2 overflow-auto text-xs">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReset} variant="outline">
                다시 시도
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                페이지 새로고침
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 에러 메시지 컴포넌트
 * 일반적인 에러 상태 표시에 사용됩니다.
 */
interface ErrorMessageProps {
  /** 에러 메시지 */
  message: string;
  /** 에러 설명 (선택사항) */
  description?: string;
  /** 재시도 핸들러 (선택사항) */
  onRetry?: () => void;
  /** 추가 클래스명 */
  className?: string;
}

export function ErrorMessage({
  message,
  description,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-lg border border-destructive bg-destructive/10 p-6 text-center ${className || ""}`}
    >
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div>
        <h3 className="mb-1 text-lg font-semibold text-destructive">{message}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          다시 시도
        </Button>
      )}
    </div>
  );
}

