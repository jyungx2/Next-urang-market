import ChatItem from "@/components/profile/chat-item";
import { useNotification } from "@/store/notification-context";
import UIContext from "@/store/ui-context";
import useCurrentUserStore from "@/zustand/currentUserStore";
import useSelectedProductStore from "@/zustand/selectedProduct";
import Image from "next/image";
import { useContext } from "react";
import { PropagateLoader } from "react-spinners";

export default function Chat({ chats, isLoading }) {
  const { toggleNotification } = useNotification();
  const { currentUser } = useCurrentUserStore();
  const { setProduct } = useSelectedProductStore();

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
    <div className="flex flex-col flex-1 gap-8">
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

          <button className="cursor-pointer" onClick={toggleNotification}>
            <Image src="/icons/alarm.svg" alt="icon" width={28} height={28} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center flex-col h-full bg-[var(--color-bg)] gap-12">
          <PropagateLoader color={"#009afa"} />

          <p className="font-medium">{`${currentUser?.nickname}님의 채팅 리스트를 가져오고 있어요..`}</p>
        </div>
      ) : chats.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-full bg-[var(--color-bg)] gap-4 font-medium">
          <p>아직 시작된 채팅이 없어요.</p>
          <p>첫 거래 대화를 시작해보세요 🙂</p>
        </div>
      ) : (
        <div role="list" className="flex flex-col gap-6">
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
              onClick={() => {
                setProduct(room);
                console.log("채팅방 클릭:", room);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
