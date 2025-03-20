import Image from "next/image";
import Link from "next/link";

export default function UserLocation() {
  return (
    <div className="flex justify-between">
      <button className="flex items-center cursor-pointer">
        <Image src="/icons/location.svg" alt="icon" width={20} height={20} />
        <h3 className="font-bold text-[1.6rem] ml-2">효성동 이웃</h3>
        <Image
          src="/icons/chevron-down-micro.svg"
          alt="icon"
          width={14}
          height={14}
        />
      </button>

      <Link href="/" className="relative w-[30px] aspect-square">
        <Image
          src="/images/example.jpg"
          alt="icon"
          fill
          className="rounded-full object-cover"
        />
      </Link>
    </div>
  );
}
