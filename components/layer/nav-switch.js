// NavSwitch.jsx — Provider 안쪽에서만 사용
import { useSidebar } from "@/store/sidebar-context";
import { useSearch } from "@/store/search-context";
import { useSettings } from "@/store/settings-context";
import { useNotification } from "@/store/notification-context";
import MainNav from "@/components/layout/main-nav";
import ProductItemNav from "@/components/layout/productItem-nav";

export function NavSwitch({ isHiddenNavPage, isProductItemNavPage }) {
  const { isSidebarOpen } = useSidebar();
  const { isSearchOpen } = useSearch();
  const { isSettingsOpen } = useSettings();
  const { isNotificationOpen } = useNotification();

  const blocked =
    isSidebarOpen ||
    isSearchOpen ||
    isSettingsOpen ||
    isNotificationOpen ||
    isHiddenNavPage;

  if (blocked) return null;
  return isProductItemNavPage ? <ProductItemNav /> : <MainNav />;
}
