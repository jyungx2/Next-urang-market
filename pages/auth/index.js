import Layout from "@/components/layout/layout";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

// pages/index.tsx 또는 app/page.tsx
export default function AuthPage() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-between text-white px-4 py-8 min-h-screen">
      {/* 로고 */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Image src="/favicon.ico" alt="Logo" width={120} height={120} />
          <h1 className="text-[3rem] font-bold my-4">Welcome to Urang</h1>
          <p className="text-[2rem] text-gray-400 mt-1">
            Your friendly neighborhood marketplace
          </p>
        </div>
      </div>

      {/* 버튼 / 링크 */}
      <div className="w-full flex flex-col items-center">
        <button
          className="w-full bg-[var(--color-primary-400)] text-white text-[2rem] py-6 rounded-lg font-semibold mb-6 cursor-pointer"
          onClick={() => router.push("/auth/signup")}
        >
          Get started
        </button>
        <p className="text-[1.6rem] text-gray-400">
          Have an account already?
          <Link
            href="/auth/login"
            className="text-[var(--color-primary-400)] font-medium ml-4 cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
AuthPage.getLayout = function haveLayout(page) {
  return (
    <div className="min-h-screen max-w-[640px] mx-auto bg-[var(--color-com-bg)]">
      {page}
    </div>
  ); // Layout 안 씌움
};
