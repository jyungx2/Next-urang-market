import Notification from "@/components/common/notification";
import Layout from "@/components/layout/layout";
import Chat from "@/components/profile/chat";
import UIContext from "@/store/ui-context";
import { useContext } from "react";

export default function StayPage() {
  const { isNotificationOpen } = useContext(UIContext);

  const DUMMY_CHAT_DATA = [
    {
      id: 1,
      username: "권나라",
      location: "캘거리",
      since: "2w",
      content: "안녕하세요! 캘거리 어디쯤 사시나요?",
    },
    {
      id: 2,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 3,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
    {
      id: 4,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 5,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
    {
      id: 6,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 7,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
    {
      id: 8,
      username: "이장사",
      location: "위니펙",
      since: "10h",
      content: "안녕하세요! 혹시 20000원에 거래 가능하실까요?",
    },
    {
      id: 9,
      username: "신재이",
      location: "토론토",
      since: "4min",
      content: "안녕하세요!",
    },
  ];

  return (
    <div className="flex flex-col p-6 bg-[var(--color-bg)]">
      {!isNotificationOpen && <Chat chats={DUMMY_CHAT_DATA} />}
      {isNotificationOpen && <Notification />}
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
StayPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>; // Layout 안 씌움
};
