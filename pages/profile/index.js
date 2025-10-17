import Activities from "@/components/community/activities";
import Services from "@/components/community/services";
import Settings from "@/components/community/settings";
import Layout from "@/components/layout/layout";
import Profile from "@/components/profile/profile";

export default function ProfilePage() {
  return (
    <div className="flex flex-col p-6 bg-[var(--color-bg)] h-full">
      <main className="flex flex-col gap-14">
        <Profile />

        <Services />
        <Activities />
        <Settings />
      </main>
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ProfilePage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
