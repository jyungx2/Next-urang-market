import useCurrentUserStore from "@/zustand/currentUserStore";
import { useMutation } from "@tanstack/react-query";
import { getSession, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
  // const { currentUser } = useCurrentUserStore();
  const setCurrentUser = useCurrentUserStore((s) => s.setCurrentUser);
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/";
  const { data: session } = useSession(); // ✅ NextAuth의 세션 상태 구독

  // 🚧 세션이 변경될 때마다 전역상태 동기화
  // (로그인 성공 후 자동 갱신되면 이 effect가 알아서 반응)
  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
      console.log("세션 변경 감지:", session.user);
    }
  }, [session, setCurrentUser]);

  const login = useMutation({
    // 1) 서버 호출만 담당 (redirect: false로 NextAuth가 자동 이동하지 않게)
    mutationFn: async (registeredUser) => {
      const res = await signIn("phoneLogin", {
        redirect: false,
        username: registeredUser.username,
        birthdate: registeredUser.birthdate,
        callbackUrl, // ✅ 성공 시 돌아갈 곳을 명시
      });

      // res.error: 로그인 실패 시 서버에서 보내는 에러 메시지
      // NextAuth는 { ok?: boolean; error?: string | null } 반환
      if (!res.ok) throw new Error(res.error || "로그인에 실패했습니다.");
    },
    // 2) 성공 후 사이드이펙트 (세션 다시 읽기 + 전역상태 반영 + 라우팅)
    onSuccess: () => {
      // ☑️ 세션 동기화 (가끔 늦게 갱신되니 한 번 재시도): 세션 갱신: getSession()이 바로 갱신 안될 때가 있어 200–300ms 한 번 재시도 정도는 실무에서 자주 둔다.
      // let session = await getSession();
      // if (!session) {
      //   await new Promise((r) => setTimeout(r, 300)); // 300ms 대기
      //   session = await getSession(); // 재시도
      // }

      // 🚧 대신 useSession() 훅을 쓰면 자동 갱신 이벤트에 맞춰 렌더가 갱신되므로 수동 호출을 줄일 수 있어 편리, 즉, useSession() 기반 자동 세션 갱신이 되어서 getSession()을 수동으로 반복 호출할 필요가 없어짐!
      // 👉 세션 갱신은 useSession()이 자동으로 처리하므로 별도의 getSession()이나 setTimeout() 불필요✅
      // setCurrentUser(session.user); // useEffect에서 처리하도록 변경

      // 3) 유저가 머물렀던 페이지로 이동
      router.replace(callbackUrl);
      alert("성공적으로 로그인 되었습니다. 😊");
    },
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
