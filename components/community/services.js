import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Services() {
  const { currentUser } = useCurrentUserStore();
  const router = useRouter();

  return (
    <div className="gap-6 items-center p-6 rounded-2xl bg-[var(--color-primary-50)]">
      <h2 className="mb-6 font-bold text-[2rem]">Services</h2>
      <div className="grid grid-cols-2 items-center gap-6">
        <button
          className="font-medium cursor-pointer flex items-center gap-4"
          onClick={() =>
            router.push({
              pathname: `/market`,
              query: { rcode: currentUser?.selectedLocation?.rcode },
            })
          }
        >
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>현지거래</span>
        </button>

        <button
          className="font-medium cursor-pointer flex items-center gap-4"
          onClick={() =>
            router.push({
              pathname: `/community/living-abroad`,
              query: { rcode: currentUser?.selectedLocation?.rcode },
            })
          }
        >
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>해외살이</span>
        </button>

        <button
          className="font-medium cursor-pointer flex items-center gap-4"
          onClick={() =>
            router.push({
              pathname: `/community/working-holiday`,
              query: { rcode: currentUser?.selectedLocation?.rcode },
            })
          }
        >
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>워킹홀리데이</span>
        </button>

        <button
          className="font-medium cursor-pointer flex items-center gap-4"
          onClick={() =>
            router.push({
              pathname: `/community/working-abroad`,
              query: { rcode: currentUser?.selectedLocation?.rcode },
            })
          }
        >
          <Image src="/icons/airplane.svg" alt="icon" width={20} height={20} />
          <span>해외취업</span>
        </button>
      </div>
    </div>
  );
}
