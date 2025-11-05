// /middleware.ts (또는 /middleware.js)
import { withAuth } from "next-auth/middleware";

// [1] 이 파일과 Edge Middleware의 관계
// - 이 파일 자체가 Next.js의 "Edge Middleware" 엔트리다.
// - Edge Middleware는 "요청이 라우터/페이지/Route Handler로 도달하기 전에"
//   가장 앞단(엣지)에서 실행되는 가드 레이어다. (SSR/Route Handler보다 먼저 실행)
// - 따라서 여기서 인증을 통과시키면, 이후의 페이지/API는 "이미 검증된 요청"만 받게 된다.
// - 상태가 없는(Stateless) 실행 컨텍스트이므로, Request Body 접근/DB 세션 보관은 하지 않고 주로 쿠키 기반 토큰을 읽어 빠르게 판별하는 용도로 쓴다.

// [2] withAuth 래퍼의 역할
// - next-auth/middleware가 제공하는 withAuth는 NextAuth 전용 미들웨어 래퍼다.
// - NextAuth가 발급/관리하는 세션 쿠키(혹은 JWT; session strategy에 따름)를 읽어
//   Edge에서 검증한다. 실패하면 지정한 로그인 페이지로 "즉시" 리다이렉트한다.
// - 성공 시에는 NextResponse.next()로 통과시켜 다음 단계(라우팅/렌더링)로 보낸다.
// - 즉, "미들웨어 실행(엣지) → withAuth가 쿠키 검증 → 실패시 /auth로 보냄 → 성공시 통과"의 구조다.

// NextAuth가 쿠키에 있는 세션/JWT를 Edge에서 검증
export default withAuth({
  pages: { signIn: "/auth" }, // 인증 실패 시 이동할 로그인 경로
});

// [3] 왜 matcher가 필요한가
// - Edge Middleware는 기본적으로 모든 요청에 붙일 수 있으나,
//   정적 리소스/로그인 페이지/NextAuth 자체 인증 엔드포인트에까지 적용되면
//   리다이렉트 루프나 불필요한 오버헤드가 생긴다.
// - matcher는 "어떤 요청 경로에만 미들웨어를 실행할지"를 지정해 이런 문제를 예방한다.
//   (예: /auth, /api/auth, 정적 파일 등은 제외)

// 전역 보호: 아래 예외를 제외한 "거의 모든 경로"에 미들웨어를 적용
export const config = {
  // 폴더 경로가 아니라, "요청 URL 경로(pathname)”이 다음 패턴과 일치하는 경우에만 미들웨어가 실행
  matcher: [
    // 1) 페이지 전역 보호 (다만 auth, api/auth, 정적 리소스는 제외)
    "/((?!_next/static|_next/image|favicon.ico|ad|icons|images|auth|api/auth).*)",
    // "/profile/:path*", // /profile 및 하위 경로 전체 보호

    // 2) 모든 API 보호, 단 /api/auth/*는 예외
    "/api/((?!auth).*)",
  ],
};
