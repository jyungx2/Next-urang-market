import MainCategory from "@/components/community/mainCat";
import SubCategory from "@/components/community/subCat";
import CommunityAddPost from "@/components/ui/community-addPost";

export default function CommunityLayout({ children, userLocationSlot }) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg)] relative max-w-[640px]">
      <div id="neighborhood_menu" className="flex flex-col gap-8 p-4">
        {userLocationSlot}
        {/* pathname에 포함되어 있는 mainCategory를 넘겨받기 위해 만들어진 Slot */}
        <MainCategory />
      </div>

      <div id="neighborhood_routed_area" className="flex flex-col p-3">
        <SubCategory />
      </div>

      <div className="flex flex-col grow justify-center items-center gap-12">
        {children}
      </div>

      <CommunityAddPost className="bg-amber-400" />
    </div>
  );
}
