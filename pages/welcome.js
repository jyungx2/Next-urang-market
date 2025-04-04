import Image from "next/image";

// pages/index.tsx 또는 app/page.tsx
export default function WelcomePage() {
  return (
    <main className="max-w-[640px] mx-auto flex flex-col items-center justify-between min-h-screen bg-black text-white px-4 py-8">
      {/* 로고 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Image src="/favicon.ico" alt="Logo" width={120} height={120} />
          <h1 className="text-[2.4rem] font-bold my-4">Welcome to Urang</h1>
          <p className="text-[1.8rem] text-gray-400 mt-1">
            Your friendly neighborhood marketplace
          </p>
        </div>
      </div>

      {/* 버튼 / 링크 */}
      <div className="w-full flex flex-col items-center">
        <button className="w-full bg-[var(--color-primary-400)] text-white text-[2rem] py-6 rounded-lg font-semibold mb-6">
          Get started
        </button>
        <p className="text-[1.6rem] text-gray-400">
          Have an account already?
          <a
            href="/auth"
            className="text-[var(--color-primary-400)] font-medium ml-4"
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}

// ✅ Layout 적용 안 하도록 getLayout 설정
WelcomePage.getLayout = function noLayout(page) {
  return page; // Layout 안 씌움
};
