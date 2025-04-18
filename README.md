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

## ✨feat: 유저 데이터 전역 상태 관리용 useUserStore, useCurrentUserStore 분리 적용

- 회원가입 과정 중 단계별 사용자 정보 입력을 위한 임시 저장소(useUserStore) 구현

  - 개별 Setter 포함 (username, phoneNumber, nickname 등)
  - 회원가입 완료 시 초기화되도록 resetUser 함수 포함

- 로그인한 유저의 인증 정보 및 상태를 관리하는 useCurrentUserStore 구현

  - getSession() 기반 영구 세션 저장
  - 현재 로그인 여부 확인, 유저 데이터 전역 사용 목적

- 회원가입 완료 후, 자동 로그인 시 getSession().user → useCurrentUserStore에 저장되도록 처리

## 🐛 Fix: setUser 함수형 업데이트로 인해 최신 상태 반영 안 되는 문제 수정

💡 회원가입 단계에서 setUser(prev => ...) 함수형 업데이트 직후 getUser() 호출 시, React batching으로 인해 최신 nickname, profileImage 값이 반영되지 않던 문제를 객체 기반 업데이트(setUser({...}) 방식)로 변경하여 해결.

> `zustand`의 `setUser(prev => ...)` 형태는 batching 이슈로 인해 상태가 즉시 반영되지 않을 수 있습니다.
> 따라서 직후에 getState().getUser()로 값을 가져오면 이전 상태가 반환될 수 있습니다.
> 안정적인 동기 업데이트를 위해 `setUser({ ... })` 방식 사용을 권장합니다.

## ✨ feat: 법정동 주소 검색 기능 개선 – Open API → 정적 CSV 기반 MongoDB 캐싱으로 전환 (2025/04/16)

- 공공 데이터포털에서 제공하는 전국 법정동 CSV 파일 사용
- EUC-KR 인코딩 CSV 파일을 UTF-8로 변환 및 파싱 (iconv + csv-parser)
- "삭제일자" 기반으로 현행 주소만 isActive: true로 필터링
- full 주소 필드 생성 (시도/시군구/읍면동/리 결합)
- MongoDB에 최초 1회 insertMany() (중복 삽입 방지)
- /api/search-location?keyword= 검색 API 구현 (Mongo regex 기반)
- 프론트엔드에서 ref 방식 검색 input + 검색 결과 드롭다운 구현
- 선택 시 자동 입력 및 UI 렌더링 완료

✅ 서버 부하 ↓ / 속도 ↑ / 검색 신뢰도 ↑

## ✨ feat: 주소 선택 시 해당 위치 좌표 변환 및 지도 중심 이동 기능 구현

- 주소 검색 결과 클릭 시, 선택한 주소를 input에 자동 입력
- 카카오 주소 → 좌표 변환 API(`/v2/local/search/address.json`) 연동
- 검색된 주소를 위경도로 변환 후 setCoords로 상태 반영해 새로운 좌표로 지도 UI 업데이트
- 드롭다운 클릭 시 UI/UX 개선: 자동 닫힘 + 지도 이동

🎯 주소 기반 위치 이동 UX 완성 (검색 → 선택 → 지도 반영)

## ♻️ refactor: 주소 검색 로직 SearchLocationInput 컴포넌트로 분리

- fetchLocations 함수 및 검색 결과 상태 관리 로직 분리
- 엔터 입력 및 드롭다운 주소 선택 기능 컴포넌트화
- 주소 선택 시 onSelect 콜백으로 상위 컴포넌트에 값 전달
- 공통 주소 검색 UI로 재사용 가능하도록 설계
