import ErrorMsg from "@/components/common/error-msg";
import CarrierModal from "@/components/user/carrier-modal";
import Timer from "@/components/user/timer";
import useUserStore from "@/zustand/userStore";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

// react-hook-form으로 ref 없이 입력값을 관리
// react-query로 createUser, sendCode, verifyCode 요청을 mutation으로 관리 -> 코드 가독성 및 유지보수 향상!!
const phoneExp = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export default function SignupForm() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(180); // 3분 = 180초

  // 1️⃣ CSS Styling
  const [selectedCarrier, setSelectedCarrier] = useState("통신사"); // 선택된 통신사 (기본값: 라벨 '통신사')
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 여부 상태

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false); // 모달 닫기

  // 모달에서 통신사 선택 시 호출되는 핸들러
  const handleSelectCarrier = (carrier) => {
    setSelectedCarrier(carrier); // 선택한 통신사 상태 업데이트
    setValue("carrier", carrier, { shouldValidate: true }); // ✅ RHF 값도 갱신 + 즉시 검증
    // shouldValidate(true): 값 세팅과 동시에 해당 필드의 유효성 검사를 즉시 실행
  };

  // 2️⃣ 인증코드 요청 후, 버튼 스타일링 변경
  const [isCodeSent, setIsCodeSent] = useState(false);

  // 3️⃣ 유저 입력값을 zustand 라이브러리로 전역적으로 저장 & 관리
  const { setUsername, setBirthdate, setPhoneNumber, setIsVerified } =
    useUserStore();

  // 🌟 useForm CODE
  const {
    register,
    handleSubmit, // 여기서 회원가입 최종 요청 안 보낼거라 필요x
    trigger, // 제출 로직 없이, 특정 필드만 "검증"하고 싶을 때 사용
    getValues,
    watch,
    setValue, // 특정 필드 값을 프로그래밍적으로 설정하고 싶을 때 사용
    formState: { errors, isValid },
  } = useForm({
    mode: "onSubmit", // 처음엔 submit할 때만 에러 보여줌
    // * onChange: submit 버튼 제출이 아닌, 입력값 변경 시마다 검증
    // reValidateMode: "onChange", // 입력값 변경 시마다 재검증
    // criteriaMode: "all", // 모든 에러 메시지 수집
    shouldFocusError: true, // 에러 발생 시 해당 입력란에 포커스
    reValidateMode: "onChange", // 일단 한번 submit 후엔 값 바꿀 때마다 재검증
    defaultValues: {
      username: "",
      birthdate: "",
      phoneNumber: "",
      code: "",
      carrier: "", // ✅ 통신사도 RHF로 관리(숨은 필드)
    },
  });

  // 🌟 React Query CODE
  const sendCodeMutation = useMutation({
    mutationFn: async (phoneNumber) => {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        body: JSON.stringify({ phoneNumber }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "인증번호 전송 실패");

      if (data.mockCode) {
        console.log("🔐 개발용 인증번호:", data.mockCode); // 테스트 편의용
        alert(`개발용 인증번호: ${data.mockCode}`);
      }
      return data;
    },
    onSuccess: () => {
      alert("인증번호가 전송되었습니다.");

      setIsCodeSent(true);
      setTimeLeft(180);
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async ({ phoneNumber, code }) => {
      // return fetch("/api/auth/verify-code", {
      //   method: "POST",
      //   body: JSON.stringify({ phoneNumber, code }),
      //   headers: { "Content-Type": "application/json" },
      // }).then((res) => {
      //   if (!res.ok) throw new Error("인증 실패ㅇ");
      //   return res.json();
      // });
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        body: JSON.stringify({ phoneNumber, code }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "인증번호 검증 실패");
      //  throw 대신 return Promise.reject(new Error(...))도 동일하게 작동
      // fetch는 axios와 다르게, HTTP 4xx/5xx여도 예외를 던지지 않기 때문에,
      // 즉, 서버에서 400, 401, 500 같은 에러 응답을 줘도 resolve(settled상태가 결정) → res.ok === false 상태로 들어옴.
      // 그래서 클라이언트에서 !res.ok 체크 후 직접 throw new Error(...) 해줘야 React Query onError로 넘어감.
      console.log("인증 성공: ", data.message);
    },
    onSuccess: () => {
      alert("인증 성공! 🎉");

      // ✅ react-hook-form의 현재 값 가져오기(전역 스콥에서 가져오면 null로 리턴돼 오류발생)
      const { username, birthdate, phoneNumber } = getValues();

      // ✅ zustand 전역 상태 저장
      setUsername(username);
      setBirthdate(birthdate);
      setPhoneNumber(phoneNumber);
      setIsVerified(true);

      // ✅ 다음 단계로 이동
      router.push("/auth/signup/profile-register");
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  return (
    <form className="flex flex-col gap-8 flex-grow">
      <div className="flex flex-col gap-4">
        <label className="text-[2rem] font-bold">이름을 입력하세요.</label>
        <div
          className={`border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-2xl px-2`}
        >
          <input
            type="text"
            placeholder="Enter name"
            className="inputUnset inputCustom"
            {...register("username", {
              required: "이름은 필수입니다.",
              minLength: {
                value: 2,
                message: "2글자 이상 입력하세요.",
              },
              pattern: {
                value: /^[^\d]*$/,
                message: "숫자는 입력할 수 없습니다.",
              },
            })}
          />
        </div>
        <ErrorMsg target={errors.username} />
      </div>
      <div className="flex flex-col gap-4">
        <label className="text-[2rem] font-bold">생년월일을 입력하세요.</label>
        <div
          className={`border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-2xl px-2`}
        >
          <input
            type="text"
            maxLength={6} // HTML 차원에서도 6자 제한
            placeholder="yy/mm/dd"
            className="inputUnset inputCustom"
            {...register("birthdate", {
              required: "생년월일은 필수입니다.",
              setValueAs: (v) => (v ?? "").toString().replace(/\D/g, ""), // 사용자가 -, 공백 등 을 입력해도 즉시 숫자만 남도록 정규화
              validate: {
                sixDigits: (v) =>
                  /^\d{6}$/.test(v) || "숫자 6자리(YYMMDD)로 입력하세요.", // 정확히 6자리 숫자만 통과.
              },
            })}
          />
        </div>
        <ErrorMsg target={errors.birthdate} />
      </div>
      <div className="flex flex-col gap-4">
        {/* 폼 컨테이너: 통신사 선택 버튼과 전화번호 입력 필드를 한 줄에 배치 */}
        <label className="text-[2rem] font-bold">전화번호를 입력하세요.</label>
        <div className="flex space-x-2 items-stretch">
          {/* 통신사 선택 버튼 (디자인상 select 역할을 하는 버튼) */}
          <div className="flex flex-col gap-2 w-[8rem]">
            <button
              type="button"
              onClick={openModal}
              className="h-[5rem] px-4 border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-md bg-white text-gray-500 shadow-sm"
            >
              {selectedCarrier}
              {/* ▲ 버튼 라벨: 현재 선택된 통신사 표시 (기본값은 '통신사') */}
            </button>
            <ErrorMsg target={errors.carrier} className="whitespace-pre-line" />
          </div>

          {/* 전화번호 입력 필드 */}
          <div className="flex flex-col gap-2 flex-grow ">
            <input
              type="tel"
              placeholder="전화번호 입력"
              {...register("phoneNumber", {
                required: "전화번호는 필수입니다.",
                pattern: {
                  value: phoneExp,
                  message: "전화번호 양식에 맞지 않습니다.",
                },
              })}
              className={`h-[5rem] px-4 border-2 border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)] rounded-md focus:outline-none ${
                errors.phoneNumber ? "border-[var(--color-error-500)]" : ""
              }`}
            />
            <ErrorMsg target={errors.phoneNumber} />
          </div>

          <button
            className={`h-[5rem] bg-[var(--color-grey-500)] hover:bg-[var(--color-grey-700)] rounded-xl text-white px-4 cursor-pointer`}
            onClick={async () => {
              const ok = await trigger([
                "username",
                "birthdate",
                "carrier",
                "phoneNumber",
              ]);
              if (!ok) return;
              sendCodeMutation.mutate(getValues("phoneNumber"));
            }}
            type="button"
          >
            인증번호 요청
          </button>
        </div>

        {/* 모달 컴포넌트 (CarrierModal) - AnimatePresence로 감싸서 진입/퇴장 애니메이션 적용 */}
        <AnimatePresence>
          {modalOpen && (
            <CarrierModal
              isOpen={modalOpen} // 모달 닫기 함수 전달
              onClose={closeModal}
              onSelect={handleSelectCarrier} // 통신사 선택 함수 전달
            />
          )}
        </AnimatePresence>
        {/* 통신사도 RHF에 연결(검증 가능)하기 위해 input 숨김 */}
        <input
          type="hidden"
          {...register("carrier", {
            validate: (v) => !!v || "통신사를\n선택하세요.",
          })}
        />
      </div>

      <div className="flex flex-col gap-4">
        <label className="text-[2rem] font-bold">인증코드를 입력하세요.</label>
        <div className="flex space-x-2 items-center border-2 rounded-md border-[var(--color-grey-300)] focus-within:border-[var(--color-grey-500)]">
          <input
            placeholder="인증번호 입력"
            className="px-3 py-4 flex-1 focus:outline-none"
            {...register("code", { required: "인증번호를 입력해주세요." })}
          />
          {isCodeSent ? (
            <span className="p-4">
              <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />
            </span>
          ) : (
            <span className="p-4">3:00</span>
          )}
        </div>
      </div>

      <div className="mt-auto">
        <button
          type="button"
          className={`font-bold h-[4rem] bg-[var(--color-primary-500)] p-4 w-full rounded-lg text-white ${
            isCodeSent
              ? "bg-[var(--color-primary-500)] hover:bg-[var(--color-primary-700)] cursor-pointer"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={() =>
            verifyCodeMutation.mutate({
              phoneNumber: getValues("phoneNumber"),
              code: getValues("code"),
            })
          }
          // ❌ !getValues("code"): 실시간 반영이 안 되므로 계속 false로 평가될 수 있음
          disabled={!isCodeSent || !watch("code")} // ✅ 인증번호 전송 전엔 비활성화
        >
          Confirm
        </button>
      </div>
    </form>
  );
}
