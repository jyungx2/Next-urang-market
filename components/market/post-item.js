import Image from "next/image";

export default function PostItem({ title, location, time, price }) {
  return (
    <li className="flex gap-8 border-b-1 py-8">
      <Image src="/images/example.jpg" alt="image" width={120} height={120} />
      <div className="flex flex-col gap-2 grow basis-0 min-w-0">
        <div className="flex justify-between">
          <h1 className="text-4xl">{title}</h1>
          <Image
            src="/icons/ellipsis-vertical.svg"
            alt="icon"
            width={24}
            height={24}
          />
        </div>

        <p className="text-[1.6rem]">
          {location} · {time}
        </p>
        <p className="font-bold text-3xl">{price}</p>
        <div className="flex gap-4 ml-auto mt-auto">
          <div className="flex items-center gap-1">
            <Image src="/icons/chat.svg" alt="icons" width={28} height={28} />
            <span>24</span>
          </div>
          <div className="flex items-center">
            <Image src="/icons/heart.svg" alt="icons" width={28} height={28} />
            <span>10</span>
          </div>
        </div>
      </div>
    </li>
  );
}
