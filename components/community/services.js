import Image from "next/image";

export default function Services() {
  return (
    <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
      <h2 className="mb-6 font-bold text-[2rem]">Services</h2>
      <div className="grid grid-cols-2 items-center gap-6">
        <button className="font-medium cursor-pointer flex items-center gap-4">
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>현지거래</span>
        </button>
        <button className="font-medium cursor-pointer flex items-center gap-4">
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>해외살이</span>
        </button>
        <button className="font-medium cursor-pointer flex items-center gap-4">
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>워킹홀리데이</span>
        </button>
        <button className="font-medium cursor-pointer flex items-center gap-4">
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>해외취업</span>
        </button>
      </div>
    </div>
  );
}
