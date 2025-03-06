import Image from "next/image";

export default function PostsList({ posts }) {
  return (
    <>
      <ul className="flex flex-col">
        <li className="flex gap-8 border-b-1 py-8">
          <Image
            src="/images/example.jpg"
            alt="image"
            width={160}
            height={160}
          />
          <div className="flex flex-col gap-2 grow basis-0 min-w-0">
            <h1 className="text-4xl">6개월 사용한 쿠첸(전기밥솥)</h1>
            <p className="text-[2rem]">계산동 - 1h</p>
            <p className="font-bold text-3xl">100,000원</p>
            <div className="flex gap-4 ml-auto mt-auto">
              <div className="flex items-center gap-1">
                <Image
                  src="/icons/chat.svg"
                  alt="icons"
                  width={28}
                  height={28}
                />
                <span>24</span>
              </div>
              <div className="flex items-center">
                <Image
                  src="/icons/heart.svg"
                  alt="icons"
                  width={28}
                  height={28}
                />
                <span>10</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
