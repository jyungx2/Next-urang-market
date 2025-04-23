import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserLocation() {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();

  return (
    <div className="flex justify-between items-center">
      <button
        className="flex items-center cursor-pointer bg-[var(--color-secondary-900)] rounded-full p-4 gap-1"
        onClick={() => router.push("/community/location-search")}
      >
        <Image
          src="/icons/location-w-filled.svg"
          alt="icon"
          width={18}
          height={18}
        />
        <h3 className="font-bold text-[1.6rem] text-[var(--color-grey-bg)] ml-2">
          {currentUser?.selectedLocation
            ? currentUser?.selectedLocation?.keyword?.slice(-1)[0]
            : currentUser?.location?.keyword?.slice(-1)[0]}{" "}
          이웃
        </h3>
        <Image
          src="/icons/chevron-down-w-micro.svg"
          alt="icon"
          width={10}
          height={10}
        />
      </button>

      <Link href="/" className="relative w-[30px] aspect-square">
        <Image
          src={currentUser?.profileImage || "/icons/profile-signup.svg"}
          alt="icon"
          fill
          className="rounded-full object-cover"
        />
      </Link>
    </div>
  );
}
