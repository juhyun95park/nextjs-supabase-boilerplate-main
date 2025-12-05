import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import CartIcon from "@/components/navbar/cart-icon";

const Navbar = () => {
  return (
    <header
      className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto"
      role="banner"
    >
      <Link
        href="/"
        className="text-2xl font-bold"
        aria-label="홈으로 이동"
      >
        SaaS Template
      </Link>
      <nav className="flex gap-4 items-center" role="navigation" aria-label="주요 네비게이션">
        <SignedOut>
          <SignInButton mode="modal">
            <Button aria-label="로그인">로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <CartIcon />
          <Link href="/orders">
            <Button variant="ghost" aria-label="주문 내역 보기">
              주문 내역
            </Button>
          </Link>
          <UserButton />
        </SignedIn>
      </nav>
    </header>
  );
};

export default Navbar;
