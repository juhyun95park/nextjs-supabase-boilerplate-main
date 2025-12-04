# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하고 커스터마이징하는 방법을 설명합니다.

## 참고 문서

- [Clerk 로컬라이제이션 공식 가이드](https://clerk.com/docs/guides/customizing-clerk/localization)

## 기본 설정

프로젝트에는 이미 한국어 로컬라이제이션이 적용되어 있습니다.

### 현재 설정

`app/layout.tsx`에서 다음과 같이 설정되어 있습니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      localization={koKR}
      appearance={{
        cssLayerName: "clerk", // Tailwind CSS 4 호환성
      }}
    >
      <html lang="ko">
        {/* ... */}
      </html>
    </ClerkProvider>
  );
}
```

### 적용되는 컴포넌트

다음 Clerk 컴포넌트들이 한국어로 표시됩니다:

- **로그인 페이지** (`SignIn`): "이메일로 계속하기", "비밀번호" 등
- **회원가입 페이지** (`SignUp`): "새 계정 만들기", "이미 계정이 있으신가요?" 등
- **사용자 버튼** (`UserButton`): "프로필", "계정 설정" 등
- **에러 메시지**: 모든 인증 관련 에러 메시지

> **참고**: Clerk Account Portal(호스팅된 계정 관리 페이지)는 여전히 영어로 표시됩니다.

## 커스텀 로컬라이제이션

특정 텍스트를 브랜드에 맞게 수정하려면 커스텀 로컬라이제이션을 사용하세요.

### 1. 커스텀 로컬라이제이션 파일 사용

`lib/clerk/localization.ts` 파일을 수정하여 커스텀 로컬라이제이션을 만들 수 있습니다:

```typescript
import { koKR } from "@clerk/localizations";

export const customKoKR = {
  ...koKR,
  signIn: {
    ...koKR.signIn,
    title: "브랜드명에 맞게 수정",
    subtitle: "계정에 로그인하세요",
  },
};
```

### 2. 커스텀 로컬라이제이션 적용

`app/layout.tsx`에서 커스텀 로컬라이제이션을 사용:

```tsx
import { customKoKR } from '@/lib/clerk/localization';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customKoKR}>
      {/* ... */}
    </ClerkProvider>
  );
}
```

## 에러 메시지 커스터마이징

에러 메시지를 커스터마이징하려면 `unstable__errors` 객체를 수정하세요:

```typescript
import { koKR } from "@clerk/localizations";

export const customKoKR = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access:
      "접근이 허용되지 않은 이메일 도메인입니다. 접근을 원하시면 관리자에게 문의해주세요.",
    form_identifier_not_found:
      "입력하신 이메일 또는 사용자명을 찾을 수 없습니다.",
    form_password_pwned:
      "이 비밀번호는 보안상의 이유로 사용할 수 없습니다. 다른 비밀번호를 선택해주세요.",
    form_password_length_too_short:
      "비밀번호는 최소 8자 이상이어야 합니다.",
  },
};
```

### 사용 가능한 에러 키

Clerk의 소스 코드에서 사용 가능한 모든 에러 키를 확인할 수 있습니다. `@clerk/localizations` 패키지의 타입 정의를 참고하거나, [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization#customize-error-messages)를 확인하세요.

## 지원되는 언어

Clerk는 다음 언어를 지원합니다:

- 한국어 (ko-KR) ✅ **현재 사용 중**
- 영어 (en-US, en-GB)
- 일본어 (ja-JP)
- 중국어 (zh-CN, zh-TW)
- 기타 50개 이상의 언어

전체 언어 목록은 [Clerk 로컬라이제이션 문서](https://clerk.com/docs/guides/customizing-clerk/localization#languages)를 참고하세요.

## 주의사항

1. **실험적 기능**: 로컬라이제이션 기능은 현재 실험적(experimental)입니다. 문제가 발생하면 [Clerk 지원팀](https://clerk.com/contact/support)에 문의하세요.

2. **Account Portal**: 로컬라이제이션은 Clerk 컴포넌트에만 적용되며, 호스팅된 Account Portal은 여전히 영어로 표시됩니다.

3. **타입 안정성**: 커스텀 로컬라이제이션을 만들 때 TypeScript 타입을 확인하여 올바른 키를 사용하세요.

## 예제

완전한 예제는 `lib/clerk/localization.ts` 파일을 참고하세요.

