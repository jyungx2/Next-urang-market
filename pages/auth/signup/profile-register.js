import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { useRouter } from "next/router";

export default function ProfileRegisterPage() {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState();
  const [isOpen, setIsOpen] = useState(false);

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
      <form className="flex flex-col gap-10 flex-grow">
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
