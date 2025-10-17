import Notification from "@/components/common/notification";
import Layout from "@/components/layout/layout";
import Chat from "@/components/profile/chat";
import UIContext from "@/store/ui-context";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { PuffLoader } from "react-spinners";

export default function ChatPage() {
  const { isNotificationOpen } = useContext(UIContext);
  const { currentUser } = useCurrentUserStore();

  // ✅ 로그인한 유저의 userId로 채팅방 목록 요청
  const { data: chatRooms = [], isLoading } = useQuery({
    queryKey: ["chatRooms", currentUser?.id],
    queryFn: async () => {
      const res = await fetch(`/api/chat/chatRooms?userId=${currentUser.id}`);
      const data = await res.json();
      console.log("채팅방 리스트: ", data);
      return data.chatRooms;
    },
    enabled: !!currentUser?.id, // userId가 있을 때만 요청
  });

  return (
    <div className="h-full flex flex-col p-6 bg-[var(--color-bg)]">
      {isNotificationOpen ? (
        <Notification />
      ) : (
        <Chat chats={chatRooms} isLoading={isLoading} />
      )}
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ChatPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
