/**
 * @file components/Navbar.tsx
 * @description 메인 네비게이션 바 컴포넌트
 *
 * legodt.kr 스타일을 참고한 깔끔한 네비게이션 바입니다.
 * 검색 기능, 로그인, 장바구니, 주문 내역 등을 포함합니다.
 */

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import CartIcon from "@/components/navbar/cart-icon";
import SearchBar from "@/components/search/search-bar";
import { ShoppingBag } from "lucide-react";

const Navbar = () => {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm"
      role="banner"
    >
      <div className="container mx-auto px-4">
        {/* 상단 네비게이션 */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* 로고 */}
          <Link
            href="/"
            className="group flex items-center gap-3 text-xl font-bold transition-all hover:scale-105"
            aria-label="홈으로 이동"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md transition-transform group-hover:scale-110 group-hover:shadow-lg">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight">OZ SHOP</span>
              <span className="text-xs font-normal text-muted-foreground">
                Premium Shopping
              </span>
            </div>
          </Link>

          {/* 검색 바 (데스크톱) */}
          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          {/* 우측 메뉴 */}
          <nav
            className="flex items-center gap-2"
            role="navigation"
            aria-label="주요 네비게이션"
          >
            {/* 검색 아이콘 (모바일) */}
            <div className="md:hidden">
              <SearchBar className="max-w-[200px]" />
            </div>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all hover:bg-primary/10 hover:text-primary"
                  aria-label="로그인"
                >
                  로그인
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/90 shadow-md transition-all hover:shadow-lg hover:scale-105"
                  aria-label="회원가입"
                >
                  회원가입
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <CartIcon />
              <Link href="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all hover:bg-primary/10 hover:text-primary"
                  aria-label="주문 내역 보기"
                >
                  주문 내역
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </nav>
        </div>

        {/* 하단 카테고리 메뉴 */}
        <div className="hidden h-14 items-center border-t bg-muted/30 md:flex">
          <nav
            className="flex h-full items-center gap-1"
            role="navigation"
            aria-label="카테고리 네비게이션"
          >
            <Link
              href="/products"
              className="flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              전체 상품
            </Link>
            <Link
              href="/products?category=electronics"
              className="flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              전자제품
            </Link>
            <Link
              href="/products?category=clothing"
              className="flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              의류
            </Link>
            <Link
              href="/products?category=books"
              className="flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              도서
            </Link>
            <Link
              href="/products?category=home"
              className="flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              홈&리빙
            </Link>
            <Link
              href="/products?category=sports"
              className="flex h-full items-center border-b-2 border-transparent px-4 text-sm font-medium transition-all hover:border-primary hover:bg-primary/5 hover:text-primary"
            >
              스포츠
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
