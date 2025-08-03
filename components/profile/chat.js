import ChatItem from "@/components/profile/chat-item";
import UIContext from "@/store/ui-context";
import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useContext } from "react";

export default function Chat({ chats }) {
  const { toggleNotificationPage } = useContext(UIContext);
  const { currentUser } = useCurrentUserStore();

  // ✅ 최근 메시지가 언제 왔는지 "10h", "2w" 형태로 변환
  function formatTimeSince(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diff = (now.getTime() - date.getTime()) / 1000;

    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}min`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
    return `${Math.floor(diff / 604800)}w`;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[2.4rem]">Chats</h1>
        <div className="flex gap-6 items-center">
          <button className="cursor-pointer">
            <Image src="/icons/filter.svg" alt="icon" width={28} height={28} />
          </button>

          <button className="cursor-pointer">
            <Image
              src="/icons/bookmark.svg"
              alt="icon"
              width={28}
              height={28}
            />
          </button>

          <button className="cursor-pointer" onClick={toggleNotificationPage}>
            <Image src="/icons/alarm.svg" alt="icon" width={28} height={28} />
          </button>
        </div>
      </div>

      <div
        role="list"
        className="flex flex-col gap-10 rounded-2xl p-6 bg-[var(--color-primary-50)]"
      >
        {chats.map((room) => (
          <ChatItem
            key={room.roomId}
            roomId={room.roomId}
            opponent={
              room.buyerId === currentUser.id
                ? room.sellerNickname
                : room.buyerNickname
            }
            opponentImage={
              room.buyerId === currentUser.id
                ? room.sellerImage
                : room.buyerImage
            }
            location={room.location}
            since={formatTimeSince(room.lastMessageAt)}
            lastMessage={room.lastMessage}
          />
        ))}
      </div>
    </div>
  );
}
