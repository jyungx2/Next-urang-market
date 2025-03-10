import Image from "next/image";

export default function Profile() {
  return (
    <div className="flex flex-col gap-4 bg-amber-100">
      <header className="flex justify-between items-center bg-amber-300">
        <h1 className="font-black text-[3rem]">Profile</h1>
        <Image src="/icons/cog-6.svg" alt="icon" width={28} height={28} />
      </header>
      <div className="flex gap-6 items-center bg-amber-600 p-4 rounded-2xl">
        <Image
          src="/images/example.jpg"
          alt="profile-image"
          width={60}
          height={60}
          className="aspect-square rounded-full object-cover"
        />
        <div className="flex items-center gap-4 grow">
          <span className="font-bold text-[2.4rem]">금새롬</span>
          <div className="font-bold text-[1.4rem] bg-blue-400 rounded-2xl p-2 text-blue-50">
            36.5℃
          </div>
        </div>
        <Image
          src="/icons/chevron-right.svg"
          alt="profile-image"
          width={26}
          height={26}
        />
      </div>
    </div>
  );
}
