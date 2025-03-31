import Image from "next/image";
import Link from "next/link";

export default function TalkPostItem({
  writer,
  createdAt,
  location,
  content,
  onDetail,
}) {
  return (
    <div
      className="flex flex-col gap-6 border-t-[10px] border-[var(--color-grey-100)] p-4 cursor-pointer"
      onClick={onDetail}
    >
      <div id="post-header" className="flex gap-4 items-center text-[1.2rem]">
        <Link href="/" className="flex gap-2 items-center">
          <Image
            src="/images/example.jpg"
            alt="icon"
            width={24}
            height={24}
            className="rounded-full aspect-square object-cover"
          />
          <span className="font-bold">{writer}</span>
        </Link>

        <span className="text-gray-500">{createdAt}</span>
        <span className="flex items-center">
          <Image
            src="/icons/location-micro.svg"
            alt="icon"
            width={14}
            height={14}
          />
          {location}
        </span>
      </div>

      <div id="post-content">{content}</div>

      <div id="post-footer" className="flex gap-6">
        <button className="flex items-center gap-2">
          <Image src="/icons/like.svg" alt="icon" width={24} height={24} />
          <span id="like-num"></span>
        </button>

        <button className="flex items-center gap-2">
          <Image src="/icons/dislike.svg" alt="icon" width={24} height={24} />
          <span className="dislike-num"></span>
        </button>
      </div>
    </div>
  );
}
