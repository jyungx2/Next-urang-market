import ChatItem from "@/components/profile/chat-item";
import Image from "next/image";

export default function Chat({ chats }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-[2rem]">Chats</h1>
        <div className="flex gap-4 items-center">
          <button className="cursor-pointer">
            <Image src="/icons/filter.svg" alt="icon" width={24} height={24} />
          </button>

          <button className="cursor-pointer">
            <Image
              src="/icons/bookmark.svg"
              alt="icon"
              width={24}
              height={24}
            />
          </button>

          <button className="cursor-pointer">
            <Image src="/icons/alarm.svg" alt="icon" width={24} height={24} />
          </button>
        </div>
      </div>

      <div
        role="list"
        className="flex flex-col gap-10 rounded-2xl p-6 bg-[var(--color-primary-50)]"
      >
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            username={chat.username}
            location={chat.location}
            since={chat.since}
            content={chat.content}
          />
        ))}
      </div>
    </div>
  );
}
