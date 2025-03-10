import Image from "next/image";

export default function Chat() {
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
        <div role="listitem" className="flex items-center gap-6">
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
      </div>
    </div>
  );
}
