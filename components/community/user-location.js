import useCurrentUserStore from "@/zustand/currentUserStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserLocation({ mainCategory }) {
  const router = useRouter();
  const { currentUser } = useCurrentUserStore();

  return (
    <div className="flex justify-between items-center">
      <button
        className="flex items-center cursor-pointer bg-[var(--color-secondary-900)] rounded-full p-4 gap-1"
        onClick={() =>
          router.push({
            pathname: "/community/location-search",
            query: { from: mainCategory },
          })
        }
      >
        <Image
          src="/icons/location-w-filled.svg"
          alt="icon"
          width={18}
          height={18}
        />
        <h3 className="font-bold text-[1.6rem] text-[var(--color-grey-bg)] ml-2">
          {/* 삼항연산자에서 {}는 falsy가 아니라 truthy라서 if (obj)만으로는 빈 객체 체크가 안 됨.. => ✅ Object.keys(obj).length === 0 또는 lodash의 isEmpty() 로 체크 or ✅ store 업데이트 시 기본값을 null이나 undefined로 해주는 것도 조건 분기에 더 직관적일 수 있어요. */}
          {/* {currentUser?.selectedLocation
            ? currentUser?.selectedLocation?.keyword?.slice(-1)[0]
            : currentUser?.location?.keyword?.slice(-1)[0]}{" "} */}
          {/* 🖍️2nd 수정:  */}
          {currentUser?.selectedLocation?.keyword.slice(-1)[0]} 이웃
        </h3>
        <Image
          src="/icons/chevron-down-w-micro.svg"
          alt="icon"
          width={10}
          height={10}
          // style={{ width: "10px", height: "auto" }} // ⬅️ 지금은 너비와 높이 모두 10px씩 고정으로 해줘서 비율이 1:1이지만, 혹시 이후 CSS에서 width 또는 height를 변경할 경우, 1:1의 종횡비가 깨질 위험이 생길 수 있으므로, 똑똑하고 철저한 Next.js이 미리 경고("나중에 스타일 덮어쓸 거면, Height: auto도 같이 해주는 게 안전해)"를 준 것!
          // auto는 **"다른 축의 비율을 자동 계산해서, 원본 비율을 유지하겠다"는 뜻.
        />
      </button>

      <Link href="/profile" className="relative w-[30px] aspect-square">
        <Image
          src={currentUser?.profileImage || "/icons/profile-signup.svg"}
          alt="icon"
          fill
          className="rounded-full object-cover"
          sizes="30px"
        />
      </Link>
    </div>
  );
}
