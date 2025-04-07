import Layout from "@/components/layout/layout";
import Profile from "@/components/profile/profile";
import ProfileLayout from "@/pages/profile/layout";

export default function ProfilePage() {
  return (
    <ProfileLayout>
      <main className="flex flex-col gap-14">
        <Profile />
      </main>
    </ProfileLayout>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ProfilePage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>; // Layout 안 씌움
};
