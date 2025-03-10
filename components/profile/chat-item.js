import Image from "next/image";

export default function ChatItem({ username, location, since, content }) {
  return (
    <div role="listitem" className="flex items-center gap-6 cursor-pointer">
      <Image
        src="/images/example.jpg"
        alt="profile-image"
        width={60}
        height={60}
        className="aspect-square rounded-full object-cover"
      />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-[1.6rem]">{username}</p>
          <span className="font-light text-[1.2rem]">
            {location} · {since}
          </span>
        </div>

        <p className="font-light text-[1.4rem] text-gray-700">{content}</p>
      </div>
    </div>
  );
}

// Data Fetching Function...
