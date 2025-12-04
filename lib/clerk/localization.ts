/**
 * @file lib/clerk/localization.ts
 * @description Clerk 한국어 커스텀 로컬라이제이션
 *
 * 이 파일은 Clerk의 기본 한국어 로컬라이제이션을 확장하거나 커스터마이징합니다.
 * 특정 텍스트나 에러 메시지를 브랜드에 맞게 수정할 수 있습니다.
 *
 * 사용 방법:
 * 1. 기본 한국어 로컬라이제이션 사용: `app/layout.tsx`에서 `koKR` 직접 사용
 * 2. 커스텀 로컬라이제이션 사용: 이 파일의 `customKoKR`을 `app/layout.tsx`에서 import
 *
 * @see {@link https://clerk.com/docs/guides/customizing-clerk/localization} - Clerk 로컬라이제이션 가이드
 */

import { koKR } from "@clerk/localizations";
import type { LocalizationResource } from "@clerk/types";

/**
 * 커스텀 한국어 로컬라이제이션
 *
 * 기본 koKR을 확장하여 특정 텍스트를 커스터마이징합니다.
 * 필요에 따라 아래 예제를 참고하여 수정하세요.
 */
export const customKoKR: LocalizationResource = {
  ...koKR,
  // 로그인 페이지 커스터마이징 예제
  signIn: {
    ...koKR.signIn,
    // title: "브랜드명에 맞게 수정",
    // subtitle: "계정에 로그인하세요",
  },
  // 회원가입 페이지 커스터마이징 예제
  signUp: {
    ...koKR.signUp,
    // title: "새 계정 만들기",
    // subtitle: "지금 시작하세요",
  },
  // 에러 메시지 커스터마이징 예제
  unstable__errors: {
    ...koKR.unstable__errors,
    // not_allowed_access:
    //   "접근이 허용되지 않은 이메일 도메인입니다. 접근을 원하시면 관리자에게 문의해주세요.",
    // form_identifier_not_found:
    //   "입력하신 이메일 또는 사용자명을 찾을 수 없습니다.",
  },
};

/**
 * 기본 한국어 로컬라이제이션 (재export)
 *
 * 커스터마이징이 필요 없는 경우 이 값을 사용하세요.
 */
export { koKR };

