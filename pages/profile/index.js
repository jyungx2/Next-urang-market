import Notification from "@/components/common/notification";
import SettingsPage from "@/components/common/settings";
import Chat from "@/components/profile/chat";
import Profile from "@/components/profile/profile";
import ProfileLayout from "@/pages/profile/layout";
import UIContext from "@/store/ui-context";
import { useContext } from "react";

export default function ProfilePage() {
  const { isSettingsOpen, isNotificationOpen } = useContext(UIContext);

  const DUMMY_CHAT_DATA = [
    {
      id: 1,
      username: "권나라",
      location: "캘거리",
      since: "2w",
      content: "안녕하세요! 캘거리 어디쯤 사시나요?",
    },
    {
      id: 1,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 1,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
    {
      id: 1,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 1,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
    {
      id: 1,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 1,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
    {
      id: 1,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 1,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
  ];

  return (
    <ProfileLayout>
      {!(isSettingsOpen || isNotificationOpen) && <Profile />}
      {!(isSettingsOpen || isNotificationOpen) && (
        <Chat chats={DUMMY_CHAT_DATA} />
      )}
      {isNotificationOpen && <Notification />}
    </ProfileLayout>
  );
}
