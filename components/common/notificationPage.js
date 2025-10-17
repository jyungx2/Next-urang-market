import { useNotification } from "@/store/notification-context";
import Image from "next/image";

export default function Notification() {
  // const { toggleNotificationPage } = useContext(UIContext);
  const { toggleNotification } = useNotification();

  return (
    <div className="min-h-screen flex flex-col gap-20 text-white bg-[var(--color-com-bg)] p-6">
      <header className="flex justify-between items-center relative border-gray-300">
        <button className="cursor-pointer" onClick={toggleNotification}>
          <Image
            src="/icons/chevron-left-w.svg"
            alt="icon"
            width={28}
            height={28}
          />
        </button>
        <h1 className="font-bold text-[2.4rem] absolute left-1/2 transform -translate-x-1/2">
          Notifications
        </h1>
        <div className="flex gap-4">
          <button className="cursor-pointer">
            <Image src="/icons/bin-w.svg" alt="icon" width={28} height={28} />
          </button>
          <button className="cursor-pointer">
            <Image src="/icons/cog-6-w.svg" alt="icon" width={28} height={28} />
          </button>
        </div>
      </header>
      <main>
        <ul className="flex flex-col gap-6">
          <li className="flex gap-4 items-start border-b border-gray-500 pb-4">
            <Image
              src="/icons/heart-filled.svg"
              alt="icon"
              width={20}
              height={20}
              className="border border-gray-700"
            />
            <div className="flex flex-col gap-2 grow">
              <div className="flex justify-between text-[1.4rem]">
                <span>Favorites</span>
                <div className="flex gap-2">
                  <span>1 day ago</span>
                  <Image
                    src="/icons/ellipsis-vertical-w.svg"
                    alt="see-more"
                    width={20}
                    height={20}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <p>
                  `Price drop "루이비통 네버풀" from 230,000원 to 220,000원!`
                </p>
                <Image
                  src="/images/example.jpg"
                  alt="product-image"
                  width={50}
                  height={50}
                  className="object-cover aspect-square"
                />
              </div>
            </div>
          </li>
        </ul>
      </main>
    </div>
  );
}
