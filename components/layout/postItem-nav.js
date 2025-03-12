import Image from "next/image";

export default function PostItemNav() {
  return (
    <div className="flex items-center justify-between sticky bottom-0 z-200 bg-amber-200">
      <div className="flex justify-center items-center border-r p-6">
        <Image src="/icons/heart.svg" alt="icon" width={28} height={28} />
      </div>
      <div className="flex justify-between items-center w-full p-6">
        <p className="text-3xl font-bold">60,000원</p>
        <button className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold">
          Chat
        </button>
      </div>
    </div>
  );
}
