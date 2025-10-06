import Image from "next/image";

// pages/404.js (또는 .tsx)
export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Image
        src="/images/404-favicon.png"
        alt="icon"
        width={200}
        height={200}
        className="mb-10"
      />
      <h1 className="text-4xl font-bold mb-4">
        404 - 페이지를 찾을 수 없습니다
      </h1>
      <p className="text-lg">요청하신 페이지가 존재하지 않습니다.</p>
    </div>
  );
}
