import Chat from "@/components/profile/chat";
import Profile from "@/components/profile/profile";
import ProfileLayout from "@/pages/profile/layout";

export default function ProfilePage() {
  return (
    <ProfileLayout>
      <Profile />
      <Chat />
    </ProfileLayout>
  );
}
