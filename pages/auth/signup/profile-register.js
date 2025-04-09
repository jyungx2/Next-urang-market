import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "@/lib/cloudinary";
import useUserStore from "@/zustand/userStore";

export default function ProfileRegisterPage() {
  const {
    username,
    birthdate,
    phoneNumber,
    setProfileImage,
    setNickname,
    setUser,
  } = useUserStore(); // ✅ 여기서 미리 호출

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // 1️⃣ 프로필 이미지 UI
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleFileShow = (e) => {
    const file = e.target.files[0]; // 사용자가 업로드한 파일

    if (file) {
      // 이전 URL 정리
      if (profileImage) {
        URL.revokeObjectURL(profileImage);
      }

      // 새로운 URL 생성
      const newImageUrl = URL.createObjectURL(file); // 이미지 파일 미리보기 위해 파일 객체를 URL로 변환
      setProfileImage(newImageUrl);
    }
    setIsOpen(false);
  };

  const handleClearFile = () => {
    setProfileImage(undefined);
    handleToggle();
  };

  // 2️⃣ useForm CODE
  const { register, handleSubmit } = useForm({
    defaultValues: { profile: null, nickname: "" },
  });

  // 3️⃣ Final API request
  const finallyRegister = useMutation({
    mutationFn: async (userInfo) => {
      const { nickname, profileImage } = userInfo;

      // 1. 이미지 업로드
      let imageUrl = null;
      if (profileImage) {
        try {
          imageUrl = await uploadImage(profileImage);
        } catch (error) {
          throw new Error(
            "Image upload failed, signup was not completed. Please try again later."
          );
        }
      }

      // 2. 전역상태 저장
      setNickname(nickname);
      setProfileImage(imageUrl);

      // 3. 최종 user 객체 완성 - 저장
      setUser((prev) => ({
        ...prev,
        nickname,
        profileImage: imageUrl,
      }));

      // 4. 회원가입 API 요청 => DB에 해당 유저데이터 저장!
      const resSignup = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          birthdate,
          phoneNumber,
          profileImage: imageUrl ?? null, // MongoDB에 undefined 값은 저장되지 않지만, null은 저장됨 -> '이미지 업로드를 안 한 사용자도 Image필드가 null로 저장되길 원한다'할 때 유용
          nickname: userInfo.nickname,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("회원가입 실패");
      }

      const dataSignup = await resSignup.json();
      return dataSignup.user; // → onSuccess로 전달됨
    },
    onSuccess: async (createdUser) => {
      // 5. 회원가입 시, 자동 로그인되도록 로그인 API 요청
      const resLogin = await signIn("phoneLogin", {
        redirect: false,
        username: createdUser.username,
        birthdate: createdUser.birthdate,
        phoneNumber: createdUser.phoneNumber,
        profileImage: createdUser.profileImage,
        nickname: createdUser.nickname,
        // callbackUrl: "/profile", => redirect: true일 때, 로그인 성공하면 해당 Url로 자동 이동 (만약 redirect: false이면 callbackUrl 작성해도 이동 x)
      });
      const dataLogin = await resLogin.json();
      console.log("회원가입 후, 자동로그인 성공!", dataLogin);

      // 6. 홈페이지로 이동
      router.push("/");
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
            {profileImage ? (
              <Image
                src={profileImage}
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
                        onChange={(e) => {
                          handleFileShow(e);
                        }}
                        {...register("profileImage")}
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
