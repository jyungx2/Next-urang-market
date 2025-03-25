import MainNav from "@/components/layout/main-nav";
import classes from "./layout.module.css";
import { useContext } from "react";
import UIContext from "@/store/ui-context";
import PostItemNav from "@/components/layout/postItem-nav";
import { useRouter } from "next/router";

export default function Layout(props) {
  const { isSidebarOpen, isSearchOpen, isSettingsOpen, isNotificationOpen } =
    useContext(UIContext);

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
  const postItemNavPages = ["/market/[postId]"];

  // ✅ `MainNav`와 `PostItemNav` 모두 숨겨야 할 페이지 배열
  const hiddenNavPages = ["/market/[postId]/chat", "/community/post/new"];

  // ✅ 현재 경로가 `PostItemNav`를 표시해야 하는지 확인
  const isPostItemNavPage = postItemNavPages.some((path) => {
    const regex = new RegExp(`^${path.replace(/\[.*?\]/, "[^/]+")}$`);
    return regex.test(router.pathname);
  });

  // ✅ 현재 경로가 `hiddenNavPages`에 포함되면 `null` 반환
  const isHiddenNavPage = hiddenNavPages.some((path) => {
    const regex = new RegExp(`^${path.replace(/\[.*?\]/, "[^/]+")}$`);
    return regex.test(router.pathname);
  });

  return (
    <div className={classes["layout-container"]}>
      <main>{props.children}</main>
      {!(
        isSidebarOpen ||
        isSearchOpen ||
        isSettingsOpen ||
        isNotificationOpen ||
        isHiddenNavPage
      ) ? (
        isPostItemNavPage ? (
          <PostItemNav />
        ) : (
          <MainNav />
        )
      ) : null}
    </div>
  );
}
