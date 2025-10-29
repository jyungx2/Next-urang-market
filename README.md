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

⚠️ 회원가입 시 휴대폰 번호는 '01000000000'으로 진행해 주시고, 비밀번호는 '123456'을 입력해주세요.
> 테스트 번호 안내 (CoolSMS)
  현재 CoolSMS의 요금제 이슈로 인해, 문자 인증은 테스트용 번호에서만 가능합니다.
  회원가입 시 아래 번호 외에는 인증이 제한됩니다.

<!-- 💚 테스트용 번호 (CoolSMS 개발자 문서 기준)
if (phoneNumber !== "01000000000") {
return res
.status(400)
.json({ message: "테스트는 01000000000만 가능합니다." });
} -->

✅ 허용된 테스트 번호: 01000000000</br>
✅ 인증번호: 123456</br>
🚫 실제 휴대폰 번호로는 인증이 불가하며, 추후 요금제 변경 시 제한이 해제될 예정입니다.</br>

## 🌍 유랑마켓 (Urang Market)
해외 거주 한인을 위한 중고거래 & 커뮤니티 플랫폼
워킹홀리데이 준비부터 해외생활, 취업 후기까지 —</br> 해외살이를 한 번쯤 꿈꿨던 분들이 한 곳에서 모두 연결되는 공간입니다😉

---

### 🔹 주요 구현 기능
#### 1. 회원가입 & 인증
- 3단계 인증 절차: 위치 설정 → 본인 인증 → 프로필 등록  
- 회원가입 완료 시 자동 로그인 처리</br>
> ⚠️ 현재는 **임시 번호 010-0000-0000 / 비밀번호 123456**만 사용 가능 (CoolSMS 무료 한도 소진)  

#### 2. 홈 페이지
- 최근 검색어 기능 구현 완료
- 추천 검색어 / 위치 설정 버튼 미구현
- 워킹홀리데이·해외경험담·취업후기 섹션을 커뮤니티 게시글 기반으로 SSG 렌더링 예정 (SEO/성능 최적화)

#### 3. 사고팔고 (중고거래)
- 검색 / 위시리스트 / 채팅 기능 구현 완료
- 선택한 동네(rcode) 기준으로 거래 게시글 필터링 예정</br>
> ⚠️ 결제 시스템은 현재 카드 결제만 지원</br>
> ⚠️ 공유 / 알림 / 메뉴 버튼 기능은 미구현 상태

#### 4. 커뮤니티
- 메인 카테고리(공지사항 / 해외살이 / 워킹홀리데이 / 해외취업)
   - 각 메인 카테고리별 2~3개 서브 카테고리
   - mainCategory, subCategory, rcode를 query parameter로 관리
   - useQuery의 queryKey로 캐싱하여 렌더링 최적화

- 게시글 등록
   - 전역 상태(currentUser.selectedLocation.isVerified)로 위치 인증 여부 검사
   - 불일치 시 실시간 위치로 자동 갱신
   - Tiptap 기반 에디터로 게시글 작성 (SSR/CSR 모두 대응)
   - 게시글 등록 시 main/subCategory 선택 가능
   - 댓글, 좋아요/싫어요, 게시글 삭제 기능 구현 완료

> ⚠️ 미구현 기능:
>   - 이모지/사진 업로드
>   - 댓글 좋아요/싫어요
>   - 공지사항 작성 권한 제한(관리자 전용 예정)

#### 5. 채팅
- 거래 상세페이지에서 채팅 시작 시 자동으로 채팅방 생성
- 재접속 시 채팅 목록 페이지에서 이전 대화방 확인 가능</br>
> ⚠️ 필터링 / 북마크 / 알림 기능은 미구현 상태

#### 6. 프로필
- 커뮤니티 카테고리 바로가기 및 로그아웃 기능 지원</br>
> ⚠️ ‘나의 활동’ / 회원탈퇴 기능 미구현

---

### 🔹 기술 스택
- Frontend: Next.js 14 (Page Router), React, Javascript
- Backend: Next.js API Routes, MongoDB + Mongoose
- Styling: Tailwind CSS, Module CSS
- State Management: Zustand
- Deployment: Vercel

- Image Upload: Cloudinary
- Auth: JWT 기반 + CoolSMS (추후 Redis 연동 예정)
- Realtime API: Socket.IO
- Payment: Stripe
