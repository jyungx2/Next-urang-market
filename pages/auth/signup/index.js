import SignupForm from "@/components/auth/signup-form";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();

  return (
    <div className="max-w-[640px] mx-auto min-h-screen bg-[var(--color-bg)] flex flex-col gap-8 p-4">
      <header className="grid grid-cols-3 items-center justify-center mb-4 border-b border-[var(--color-grey-100)] pb-4">
        <button
          onClick={() => router.back()}
          type="button"
          className="relative w-[30px] aspect-square cursor-pointer"
        >
          <Image
            src="/icons/xbtn.svg"
            alt="icon"
            fill
            className="cursor-pointer"
          />
        </button>
        <h1 className="font-bold text-[2.4rem] col-span-2">
          Identify verification
        </h1>
      </header>

      <SignupForm />
    </div>
  );
}

// ✅ Layout 적용 안 하도록 getLayout 설정
SignupPage.getLayout = function noLayout(page) {
  return page; // Layout 안 씌움
};
