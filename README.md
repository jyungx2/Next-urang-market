This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

# Next-urang-market

Urang Market – Next.js 14(Page Router) | React | TypeScript | Tailwind CSS | Zustand | MongoDB | Vercel 🚀

🚀 Urang Market - 중고거래를 더 쉽고 빠르게!
Urang Market은 사용자 친화적인 중고거래 플랫폼으로, 실시간 채팅, 알림 시스템, 지역 기반 검색 기능을 제공합니다.

## 🔹 핵심 기능

📌 즉시 등록 & 거래: 간편한 상품 등록과 빠른 거래<br>
💬 실시간 채팅: 실시간으로 구매자/판매자와 소통<br>
🔔 알림 시스템: 관심 상품, 채팅, 거래 업데이트 알림<br>
📍 지역 기반 검색: 내 주변의 중고물품을 손쉽게 찾기<br>

## 🔹 기술 스택

- Frontend: Next.js 14 (Page Router), React, TypeScript
- Backend: Next.js API Routes, MongoDB
- Styling: Tailwind CSS, Module CSS
- State Management: Zustand
- Deployment: Vercel

📌 Urang Market과 함께 스마트한 중고거래를 경험해보세요! 🚀

✨feat: 유저 데이터 전역 상태 관리용 useUserStore, useCurrentUserStore 분리 적용

- 회원가입 과정 중 단계별 사용자 정보 입력을 위한 임시 저장소(useUserStore) 구현

  - 개별 Setter 포함 (username, phoneNumber, nickname 등)
  - 회원가입 완료 시 초기화되도록 resetUser 함수 포함

- 로그인한 유저의 인증 정보 및 상태를 관리하는 useCurrentUserStore 구현

  - getSession() 기반 영구 세션 저장
  - 현재 로그인 여부 확인, 유저 데이터 전역 사용 목적

- 회원가입 완료 후, 자동 로그인 시 getSession().user → useCurrentUserStore에 저장되도록 처리
