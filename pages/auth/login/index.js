import useCurrentUserStore from "@/zustand/currentUserStore";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit", // 제출 시 검증(기본값이지만 명시 권장)
    defaultValues: { username: "이유랑", birthdate: "991031" },
  });
  const { currentUser } = useCurrentUserStore();
  const router = useRouter();

  const login = useMutation({
    mutationFn: async (registeredUser) => {
      const res = await signIn("phoneLogin", {
        redirect: false,
        username: registeredUser.username,
        birthdate: registeredUser.birthdate,
      });

      // res.error: 로그인 실패 시 서버에서 보내는 에러 메시지
      if (!res.ok) throw new Error(res.error || "로그인에 실패했습니다.");

      console.log("성공적으로 로그인 되었습니다. 😊", res);

      let session = await getSession();
      if (!session) {
        await new Promise((r) => setTimeout(r, 300)); // 300ms 대기
        session = await getSession(); // 재시도
      }

      useCurrentUserStore.getState().setCurrentUser(session.user);
      console.log(currentUser, "유저 세션: ", session.user);

      // 프로필 페이지로 이동
      router.push("/profile");
    },
    onSuccess: async () => {},
    onError: (err) => {
      alert(err.message);
    },
  });

  return (
    <form
      onSubmit={handleSubmit(login.mutate)}
      className="text-white flex flex-col gap-4 px-8 py-4 min-h-screen"
    >
      <header className="grid grid-cols-3 items-center justify-center mb-4 pb-4">
        <button
          onClick={() => router.back()}
          type="button"
          className="relative w-[30px] aspect-square cursor-pointer"
        >
          <Image
            src="/icons/chevron-left.svg"
            alt="icon"
            fill
            className="cursor-pointer"
          />
        </button>
      </header>

      <h1 className="text-[2.4rem] font-bold mb-4">
        쉽고 간편하게 휴대폰 번호로 가입하세요
      </h1>

      <div className="flex gap-4 items-center">
        <label className="font-bold min-w-[80px]">이름</label>
        <input
          type="text"
          placeholder="Type in your name"
          className="px-4 py-4 border-2 border-[var(--color-grey-500)] focus-within:border-[var(--color-grey-300)] rounded-md flex-1 focus:outline-none"
          {...register("username", { required: "이름은 필수입니다." })}
        />
        {errors.username && (
          <p className="text-red-400 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="flex gap-4 items-center">
        <label className="font-bold min-w-[80px]">생년월일</label>
        <input
          type="text"
          maxLength={6} // HTML 차원에서도 6자 제한
          placeholder="Type in your birthdate"
          className="px-4 py-4 border-2 border-[var(--color-grey-500)] focus-within:border-[var(--color-grey-300)] rounded-md flex-1 focus:outline-none"
          {...register("birthdate", {
            required: "생년월일은 필수입니다.",
            setValueAs: (v) => (v ?? "").toString().replace(/\D/g, ""), // 숫자만 남김
            validate: {
              sixDigits: (v) =>
                /^\d{6}$/.test(v) || "숫자 6자리(YYMMDD)로 입력하세요.",
            },
          })}
        />
        {errors.birthdate && (
          <p className="text-red-400 text-sm">{errors.birthdate.message}</p>
        )}
      </div>

      <div className="mt-auto">
        <button
          type="submit"
          className="font-bold h-[4rem] bg-[var(--color-primary-500)] p-4 w-full rounded-lg text-white cursor-pointer hover:bg-[var(--color-primary-700)]"
        >
          로그인
        </button>
      </div>
    </form>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
LoginPage.getLayout = function haveLayout(page) {
  return (
    <div className="min-h-screen max-w-[640px] mx-auto bg-[var(--color-com-bg)]">
      {page}
    </div>
  );
};
