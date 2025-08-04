import Image from "next/image";
import { useRouter } from "next/router";

export default function ChatItem({
  roomId,
  opponent,
  opponentImage,
  location,
  since,
  lastMessage,
}) {
  const router = useRouter();
  return (
    <div
      role="listitem"
      className="flex items-center gap-6 cursor-pointer bg-[var(--color-primary-50)] p-5 rounded-2xl"
      onClick={() => router.push(`/chat/${roomId}`)}
    >
      <Image
        src={opponentImage}
        alt="profile-image"
        width={60}
        height={60}
        className="aspect-square rounded-full object-cover"
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-[1.6rem]">{opponent}</p>
          <span className="font-light text-[1.2rem]">
            {location}· {since}
          </span>
        </div>
        <p className="font-light text-[1.4rem] text-gray-700">{lastMessage}</p>
      </div>
    </div>
  );
}

// Data Fetching Function...
