import Image from "next/image";

export default function ChatItem() {
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
          <p className="font-bold text-[1.6rem]">권나라</p>
          <span className="font-light text-[1.2rem]">캘거리 · 2w</span>
        </div>

        <p className="font-light text-[1.4rem] text-gray-700">
          안녕하세요! 캘거리 어디쯤 사시나요?
        </p>
      </div>
    </div>
  );
}

// Data Fetching Function...
