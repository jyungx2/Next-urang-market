import { useRouter } from "next/router";
import { SidebarProvider } from "@/store/sidebar-context";
import { SearchProvider } from "@/store/search-context";
import { SettingsProvider } from "@/store/settings-context";
import { NotificationProvider } from "@/store/notification-context";
import { SidebarLayer } from "@/components/layer/sidebar";
import { SearchLayer } from "@/components/layer/search";
import { NotificationLayer } from "@/components/layer/notification";
import { NavSwitch } from "@/components/layer/nav-switch";
import { SettingsLayer } from "@/components/layer/settings";

export default function Layout(props) {
  const router = useRouter();

  // 특정 페이지에서 MainNav를 숨기고 FooterNav를 보여줄 경로 설정
  // const hideMainNavPages = ["/market/[postId]"]; // 여기에 특정 페이지 추가
  // const isPostItemNavPage = hideMainNavPages.some((path) =>
  //   router.pathname.startsWith(path.replace(/\[.*?\]/, ""))
  // );
  // ➡️ /market/으로 시작하는 모든 Url에서 PostItemNav가 보이는 오류 발생... post 추가하는 페이지(/market/new)에서도 보이게 됨

  // 해결코드: 즉, /market/무조건한개값 일 때만 true가 나오도록 정규표현식 수정
  // const isPostItemNavPage = /^\/market\/[^/]+$/.test(router.pathname);

  // ✅ `PostItemNav`가 보여야 할 페이지 배열
  const productItemNavPages = ["/market/[productId]"];

  // ✅ `MainNav`와 `PostItemNav` 모두 숨겨야 할 페이지 배열
  const hiddenNavPages = [
    "/market/[productId]/chat",
    "/community/post/new",
    "/market/product/new",
    "/market/product/new/choose-location",
    "/chat/[roomId]",
  ];

  // ✅ 현재 경로가 `ProductItemNav`를 표시해야 하는지 확인
  const isProductItemNavPage = productItemNavPages.some((path) => {
    const regex = new RegExp(`^${path.replace(/\[.*?\]/, "[^/]+")}$`);
    return regex.test(router.pathname);
  });

  // ✅ 현재 경로가 `hiddenNavPages`에 포함되면 `null` 반환
  const isHiddenNavPage = hiddenNavPages.some((path) => {
    const regex = new RegExp(`^${path.replace(/\[.*?\]/, "[^/]+")}$`);
    return regex.test(router.pathname);
  });

  return (
    <SidebarProvider>
      <SearchProvider>
        <SettingsProvider>
          <NotificationProvider>
            {/* 실제 요소에 해당하는 최상위 div */}
            <div className="max-w-[640px] mx-auto flex flex-col min-h-dvh h-dvh overflow-hidden">
              {/* Layout (최상위 “뚜껑”) */}
              {/* min-h-dvh h-dvh: 뷰포트 높이에 딱 맞게(넘치지 않게) “뚜껑” 고정 * 👉 아래 바텀 네비가 형제로 붙어도 총 높이가 뷰포트 + 네비로 커지지 않음/}
      {/* overflow-hidden: 전역(바디) 스크롤 차단 👉 Layout은 전역 스크롤을 끊고(overflow-hidden), MarketPage > main이 실제 세로 스크롤을 담당*/}
              <main className="flex-1 overflow-y-auto">{props.children}</main>
              {/* flex-1: 자식 페이지가 이 공간 안에서만 레이아웃/스크롤을 직접 관리하도록*/}
              {/* 👉 자식 페이지 컴포넌트: MarketPage / CommunityPage / ChatPage*/}

              {/* ✅ 컨텍스트 소비는 Provider 내부의 자식 컴포넌트에서만 */}
              <NavSwitch
                isHiddenNavPage={isHiddenNavPage}
                isProductItemNavPage={isProductItemNavPage}
              />
              {/* {!(
                isSidebarOpen ||
                isSearchOpen ||
                isSettingsOpen ||
                isNotificationOpen ||
                isHiddenNavPage
              ) ? (
                isProductItemNavPage ? (
                  <ProductItemNav />
                ) : (
                  <MainNav />
                )
              ) : null} */}

              {/* 전역 UI 레이어들 — 각 레이어 내부에서 자기 컨텍스트만 구독 */}
              <SidebarLayer />
              <SearchLayer />
              <NotificationLayer />
              <SettingsLayer />

              {/* 상태에 따라 표시되는 전역 UI들 */}
              {/* {isSidebarOpen && (
                <div className="bg-black bg-opacity-50 z-40">
                  <Sidebar />
                </div>
              )}

              {isSearchOpen && (
                <div className="bg-white z-50">
                  <SearchPage />
                </div>
              )}
              {isNotificationOpen && (
                <div className="z-50">
                  <Notification />
                </div>
              )} */}
            </div>
          </NotificationProvider>
        </SettingsProvider>
      </SearchProvider>
    </SidebarProvider>
  );
}
