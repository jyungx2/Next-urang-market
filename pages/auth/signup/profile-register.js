import Image from "next/image";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
// import { uploadImage } from "@/pages/api/auth/cloudinary"; // ❌pages/api/auth/cloudinary.js는 API Route (서버 전용) 파일이고, 그걸 import해서 클라이언트 컴포넌트에서 직접 사용하면 절대 안 돼.❌
import useUserStore from "@/zustand/userStore";
import { useForm } from "react-hook-form";
import { getSession, signIn } from "next-auth/react";
import useCurrentUserStore from "@/zustand/currentUserStore";

export default function ProfileRegisterPage() {
  const { currentUser } = useCurrentUserStore();
  const { location, username, birthdate, phoneNumber, setUser } =
    useUserStore(); // ✅ 여기서 미리 호출
  const [profileFile, setProfileFile] = useState(null); // ⬅️ Cloudinary 업로드용 File 객체
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기용

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (previewUrl) {
      console.log("🔍 미리보기 URL 생성됨:", previewUrl);
    }
  }, [previewUrl]);

  // 1️⃣ 프로필 이미지 UI
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFileShow = (e) => {
    const file = e.target.files[0]; // 사용자가 업로드한 파일

    if (file) {
      // 이전 URL 정리
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // 새로운 URL 생성
      const newPreview = URL.createObjectURL(file); // 이미지 파일 미리보기 위해 파일 객체를 URL로 변환
      setPreviewUrl(newPreview); // 브라우저에 표시할 URL
      setProfileFile(file); // 실제 Cloudinary 업로드용 (파일 저장)
    }
    setIsOpen(false);
  };

  const handleClearFile = () => {
    setPreviewUrl(null); // ← ✅ 이건 있어야 미리보기가 사라짐
    setProfileFile(null); // ← ✅ 이거도 필요! 업로드를 안 하게 됨
    handleToggle();
  };

  // 2️⃣ useForm CODE
  const { register, handleSubmit } = useForm({
    defaultValues: { profile: null, nickname: "" },
  });

  // 3️⃣ Final API request
  const finallyRegister = useMutation({
    mutationFn: async (userInfo) => {
      const { nickname } = userInfo;

      // 1. 이미지 업로드
      // let imageUrl = null;
      // if (profileImage) {
      //   try {
      //     imageUrl = await uploadImage(profileImage);
      //   } catch (error) {
      //     throw new Error(
      //       "Image upload failed, signup was not completed. Please try again later."
      //     );
      //   }
      // }
      // 🌟🌟 클라이언트 컴포넌트에서는 직접 cloudinary를 쓰지 않고,
      // API Route에 POST 요청을 보낸다. 🌟🌟

      // 1. 이미지 업로드 로직에선 profileFile을 사용해서 Cloudinary에 업로드:
      let imageUrl = null;
      if (profileFile) {
        const imageData = await profileFile.arrayBuffer();
        const base64Image = Buffer.from(imageData).toString("base64");
        const fileUri = `data:${profileFile.type};base64,${base64Image}`;

        const res = await fetch("/api/auth/cloudinary", {
          method: "POST",
          body: JSON.stringify({ image: fileUri }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        imageUrl = data.url;
      }

      console.log("✅ nickname:", nickname);
      console.log("✅ imageUrl:", imageUrl);

      // 2. 최종 user 객체 완성 (유지보수성⬆️)
      // 🚫
      // setUser((prev) => ({
      //   ...prev,
      //   nickname,
      //   profileImage: imageUrl,
      // }));

      // ✅ 위처럼 함수형 업데이트 말고 직접 객체로 업데이트하기
      setUser({
        location,
        username,
        birthdate,
        phoneNumber,
        nickname,
        profileImage: imageUrl,
      });
      const finalUser = useUserStore.getState().getUser();
      console.log("💿서버로 보낼 user: ", finalUser);

      // 3. 회원가입 API 요청 => DB에 해당 유저데이터 저장!
      const resSignup = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(finalUser),
        headers: { "Content-Type": "application/json" },
      });

      // 💥💥res.json() 호출이 무조건 res.ok보다 먼저 와야 함💥💥
      // 🖍️이유: 서버가 { message: "User exists already!" }로 응답했어도 그걸 .json()으로 꺼내기 전에 에러를 던져버려서 err.message는 하드코딩된 메시지("회원가입 실패")밖에 안 나와.
      const dataSignup = await resSignup.json();

      if (!resSignup.ok) {
        throw new Error(dataSignup.message || "회원가입 실패");
      }

      return dataSignup.user; // → onSuccess로 전달됨
    },
    onSuccess: async (createdUser) => {
      // 4. 회원가입 시, 자동 로그인되도록 로그인 API 요청
      // signIn(): fetch()처럼 Response 객체(json 호출해서 JSON 데이터(body)를 파싱해야 실제 데이터 얻음)를 반환하지 않고, 일반 JS객체를 반환 -> json() 함수 사용 쓰면 안됨.
      // ex) {ok: true, status: 200, url:"/api/auth/callback/credentials?callbackUrl=..."}
      const resLogin = await signIn("phoneLogin", {
        redirect: false,
        username: createdUser.username,
        phoneNumber: createdUser.phoneNumber,
        // callbackUrl: "/profile", => redirect: true일 때, 로그인 성공하면 해당 Url로 자동 이동 (만약 redirect: false이면 callbackUrl 작성해도 이동 x)
      });

      if (!resLogin || !resLogin.ok) {
        console.error("자동 로그인 실패", resLogin);
        alert("자동 로그인에 실패했습니다.");
        return;
      }
      console.log("자동로그인 성공 😊", resLogin);

      // 회원가입 완료 시, 임시저장소(useStore) 초기화
      useUserStore.getState().resetUser();

      // 자동로그인 성공 시, next-auth의 session에 저장된 유저정보를 영구저장소(currentUserStore)에 세팅
      // 📍getSession(): 현재 로그인된 사용자의 세션 정보를 클라이언트에서 가져오는 함수
      // 📍session.user: [...nextauth].js 파일 내 authorize()에서 리턴한 유효한 DB 사용자 객체 (signIn 성공 시 session에 자동으로 저장되기 때문에 언제든 getSession()으로 꺼내쓸 수 있음)
      let session = await getSession();

      if (!session) {
        await new Promise((r) => setTimeout(r, 300)); // 300ms 대기
        session = await getSession(); // 재시도
      }
      useCurrentUserStore.getState().setCurrentUser(session.user); // ✅ 로그인 유저 상태 저장
      console.log(currentUser, "유저 세션: ", session.user); // React 컴포넌트 내 currentUser 값은 다음 렌더링 사이클에서야 업데이트된 값을 반영하기 때문에 여전히 💥currentUser === null💥

      // 5. 홈페이지로 이동
      router.push("/profile");
    },
    onError: (err) => {
      console.error(err);
      alert(err.message);
    },
  });

  return (
    <div className="max-w-[640px] mx-auto min-h-screen bg-[var(--color-bg)] flex flex-col gap-8 p-4">
      <header className="grid grid-cols-3 items-center justify-center mb-4 border-b border-[var(--color-grey-100)] pb-4">
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

      <form
        className="flex flex-col gap-10 flex-grow"
        onSubmit={handleSubmit(finallyRegister.mutate)}
      >
        <div className="flex flex-col gap-6">
          <label className="text-[2rem] font-bold">
            Finally, choose a name and photo to introduce yourself to your
            community.
          </label>

          <div
            id="fildupload_profile_img"
            className="relative mx-auto w-[100px] h-[100px]"
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="프로필사진 미리보기"
                fill
                className="w-full h-full border border-grey-20 rounded-full object-cover p-1"
              />
            ) : (
              <div className="w-full h-full bg-[url('/icons/profile-signup.svg')]"></div>
            )}

            <div
              className="absolute bottom-1 right-0 rounded-full border border-[var(--color-grey-400)] bg-white p-2 cursor-pointer"
              onClick={handleToggle}
            >
              <button
                type="button"
                className="w-[22px] h-[22px] relative bg-[url('/icons/camera-signup.svg')] bg-no-repeat bg-center flex justify-center items-center cursor-pointer"
              >
                {isOpen && (
                  <div className="absolute left-6 top-full mt-1 p-2 shadow rounded-lg flex flex-col gap-[8px] bg-white">
                    <label
                      className="flex items-center gap-[10px] p-2 pr-8 hover:bg-sky-100 rounded cursor-pointer"
                      htmlFor="attach"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FontAwesomeIcon icon={faPen} />
                      <span className="whitespace-nowrap">등록</span>
                      <input
                        type="file"
                        id="attach"
                        accept="image/*"
                        className="hidden"
                        {...register("profileImage", {
                          onChange: handleFileShow,
                        })}
                      />
                    </label>
                    <div
                      className="flex items-center gap-[12px] p-2 hover:bg-sky-100 rounded cursor-pointer"
                      onClick={handleClearFile}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                      <span className="whitespace-nowrap">삭제</span>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-2xl px-2 cursor-pointer`}
        >
          <input
            type="text"
            placeholder="Nickname"
            className="inputUnset inputCustom"
            {...register("nickname", {
              required: "닉네임은 필수입니다.",
              minLength: {
                value: 2,
                message: "2글자 이상 입력하세요.",
              },
            })}
          />
        </div>

        <div className="mt-auto">
          <button
            type="submit"
            className="font-bold h-[4rem] bg-[var(--color-primary-500)] p-4 w-full rounded-lg text-white cursor-pointer hover:bg-[var(--color-primary-700)]"
          >
            Complete sign up
          </button>
        </div>
      </form>
    </div>
  );
}

// ✅ Layout 적용 안 하도록 getLayout 설정
ProfileRegisterPage.getLayout = function noLayout(page) {
  return page; // Layout 안 씌움
};
