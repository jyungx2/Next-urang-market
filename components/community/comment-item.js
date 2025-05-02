import Image from "next/image";

export default function CommentItem({ item }) {
  return (
    <li className="p-4 border-b border-gray-200 font-sans flex gap-2">
      <div className="shrink-0">
        <Image
          src={item.profileImage || ""}
          alt="user"
          className="rounded-full mr-2 aspect-square"
          width={24}
          height={24}
        />
      </div>

      <div className="flex-grow">
        <div className="flex items-center mb-2">
          <span className="font-bold text-[1.2rem]">{item.writer}</span>
          <span className="text-[1.2rem] text-gray-500 ml-2">1시간 전</span>
          <span className="bg-red-500 text-white text-[1rem] px-1 py-0.5 rounded-full ml-2">
            N
          </span>
        </div>

        <div className="text-[1.4rem] mb-4">
          <p>{item.content}</p>
        </div>

        <div className="flex items-center text-[1.2rem] text-gray-600">
          <button className="mr-4 border border-[var(--color-primary-200)] rounded-2xl p-2 text-[var(--color-primary-700)] font-medium cursor-pointer">
            답글쓰기
          </button>

          <div className="ml-auto flex gap-3">
            <button className="flex items-center gap-2 p-2 rounded-3xl cursor-pointer hover:bg-[var(--color-primary-50)]">
              <div className="aspect-square">
                <Image
                  src="/icons/like.svg"
                  alt="icon"
                  width={14}
                  height={14}
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-[1.4rem]">0</span>
            </button>
            <button className="flex items-center gap-2 p-2 rounded-3xl cursor-pointer hover:bg-[var(--color-primary-50)]">
              <div className="aspect-square">
                <Image
                  src="/icons/dislike.svg"
                  alt="icon"
                  width={14}
                  height={14}
                  className="object-contain rounded-full"
                />
              </div>
              <span className="text-[1.4rem]">0</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
