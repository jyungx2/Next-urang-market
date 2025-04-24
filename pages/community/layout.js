import MainCategory from "@/components/community/mainCat";
import SubCategory from "@/components/community/subCat";
import UserLocation from "@/components/community/user-location";
import CommunityAddPost from "@/components/ui/community-addPost";

export default function CommunityLayout({ children, userLocationSlot }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] relative">
      <div id="neighborhood_menu" className="flex flex-col gap-8 p-4">
        {userLocationSlot}
        {/* pathname에 포함되어 있는 mainCategory를 넘겨받기 위해 만들어진 Slot */}
        <MainCategory />
        <div className="fixed bottom-300 left-1/2 -translate-x-1/2 w-full max-w-[640px] px-6 z-50">
          <CommunityAddPost />
        </div>
      </div>

      <div id="neighborhood_routed_area" className="flex flex-col p-3">
        <SubCategory />

        {children}
      </div>
    </div>
  );
}
