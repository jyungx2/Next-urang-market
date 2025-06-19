import Image from "next/image";
import classes from "./index.module.css";
import ImagePicker from "@/components/market/image-picker";
import { useRouter } from "next/router";
import Layout from "@/components/layout/layout";
import Button from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useEffect, useState } from "react";
import ErrorMsg from "@/components/common/error-msg";
import LocationSlide from "@/components/market/location-slide";

export default function ProductAddPage() {
  const [pickedFile, setPickedFile] = useState(null); // ✅ 원본 File 객체 저장
  const { currentUser } = useCurrentUserStore();
  const router = useRouter();
  const { rcode } = router.query;
  const [showSlide, setShowSlide] = useState(false); // 1️⃣ 라우팅 없이 조건분기로 한 페이지 안에서 렌더링 여부 조정

  // const initialLat = parseFloat(router.query.lat) || null;
  // const initialLng = parseFloat(router.query.lng) || null;
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [placeName, setPlaceName] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit", // ✅ submit 시에만 유효성 검사 (기본값)
    reValidateMode: "onChange", // ✅ 에러 상태일 때, 언제 다시 검사할지
    // shouldUnregister: false, // ✅ 이걸 추가하면 Controller 필드가 언마운트될 때 값을 잃지 않음
    defaultValues: {
      writerImage: currentUser?.profileImage,
      writer: currentUser?.nickname,
      productImage: "",
      title: "",
      type: "",
      price: "",
      description: "",
      location: currentUser?.selectedLocation.keyword.slice(-1)[0],
      // lat: coords.lat,
      // lng: coords.lng,
    },
  });

  // 🔍 useForm()의 defaultValues는 최초 렌더링 시 한 번만 반영되기 때문에, currentUser처럼 비동기적으로 받아오는 데이터로부터 값을 추출해서 form 데이터로 보내야 할 때는 useEffect안에 조건문을 활용해서 setValue()로 값을 설정하는 게 의도도 명확하고, 값이 undefined로 저장될 수 있는 가능성을 줄이는 안정적인 방식!

  // 📖 공식문서: If your defaultValues rely on asynchronous data (e.g., fetched user info), use reset() or setValue() inside a useEffect instead.

  // ✏️ 디버깅 방식 정리
  // ✅ 비동기 데이터(currentUser)일 경우에는 useEffect + setValue() 방식이 더 안정적이고 명확합니다.
  // ❌ defaultValues에 바로 currentUser?.xxx를 넣으면 초기값이 undefined로 굳어져 버릴 수 있음.
  useEffect(() => {
    if (currentUser) {
      setValue("writer", currentUser.nickname);
      setValue("writerImage", currentUser.profileImage);
      setValue("location", currentUser.selectedLocation?.keyword.slice(-1)[0]);
    }
  }, [currentUser, setValue]);

  // 🖍️ 아래 useEffect 함수를 하나로 통합해서 코드 수를 줄이고 싶지만...
  // 다음과 같은 단점이 존재한다.
  // 1. 상태 중 하나만 바뀌어도 불필요한 setValue 재실행
  // 2. 의존성 배열이 길어짐
  // 3. 의도가 덜 명확하다. (어떤 조건일 때 어떤 값이 갱신되는지 흐릿함)
  // ex) placeName만 바뀌었는데도 lat, rcode 조건문이 다시 실행됨
  useEffect(() => {
    if (rcode) setValue("rcode", rcode);
  }, [rcode, setValue]);

  useEffect(() => {
    if (coords.lat && coords.lng) {
      setValue("lat", coords.lat);
      setValue("lng", coords.lng);
    }
  }, [coords, setValue]);

  useEffect(() => {
    if (placeName) setValue("placeName", placeName);
  }, [placeName, setValue]);

  const postProduct = useMutation({
    mutationFn: async (productInfo) => {
      console.log("🔥 폼 최종 값:", productInfo);
      // 1. productInfo에서 이미지 파일객체(name: productImage)만 분리
      const { productImage, ...rest } = productInfo;
      let imageUrl = null;

      const formData = new FormData();
      formData.append("file", pickedFile); // ✅ 이미지 파일 추가
      // 서버에서는 formidable이나 multer 같은 라이브러리가 multipart/form-data를 파싱할 때, input 요소의 name 속성이나 formData.append("key", value)의 key 값으로 그룹화한다. -> 여기서 정해준 key 이름에 따라 api routes 서버에서 file 객체에 접근할 때, 접근할 변수명이 달라지는 것! ex. files.file / files.attach ...

      // 🔥 여기에 preset 추가!
      // formData.append(
      //   "upload_preset",
      //   process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
      // );

      // 2. 이미지가 존재할 경우 → Cloudinary 업로드
      if (pickedFile) {
        const res = await fetch("/api/products/cloudinary", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "이미지 업로드 실패");
        }

        imageUrl = data.url;
      }

      console.log(
        "최종 DB에 저장될 cloudinary로부터 가져온 imageUrl: ",
        imageUrl
      );

      // 3. 게시글 정보 + 이미지 URL을 함께 서버에 전송
      const res = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...rest,
          productImage: imageUrl,
          sellerId: currentUser.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "게시글 등록 실패");
      }

      console.log("✅ 게시글 등록 완료:", data);
    },
    onSuccess: async () => {
      router.push({ pathname: "/market", query: { rcode } });
    },
    onError: (err) => {
      alert(err.message);
    },
  });

  return (
    <div className="flex flex-col gap-[2rem] min-h-screen p-6 bg-[var(--color-bg)]">
      {showSlide ? (
        <LocationSlide
          setShowSlide={setShowSlide}
          coords={coords}
          setCoords={setCoords}
          setPlaceName={setPlaceName}
        />
      ) : (
        <>
          <header className={classes.header}>
            <button
              className="absolute top-0 left-0 cursor-pointer"
              onClick={() => router.push(`/market?rcode=${rcode}`)}
            >
              <Image src="/icons/xbtn.svg" alt="btn" height={30} width={30} />
            </button>
            <h1 className="font-bold text-[2.4rem] text-[var(--color-com-bg)]">
              New listing
            </h1>

            {/* 📌 currentUser로부터 오는 값들 */}
            <input type="hidden" {...register("writer")} />
            <input type="hidden" {...register("writerImage")} />
            <input type="hidden" {...register("location")} />

            {/* 📌 라우터·지도에서 가져오는 값들 */}
            <input type="hidden" {...register("rcode")} />
            <input
              type="hidden"
              {...register("lat", { valueAsNumber: true })}
            />
            <input
              type="hidden"
              {...register("lng", { valueAsNumber: true })}
            />
            <input type="hidden" {...register("placeName")} />
          </header>

          <main className={classes.main}>
            <form
              onSubmit={handleSubmit(postProduct.mutate)}
              className={classes.form}
            >
              <ImagePicker
                name="productImage"
                control={control}
                rules={{ required: "이미지는 필수입니다." }}
                onImagePick={(file) => setPickedFile(file)}
              />
              {/* <div className={classes.cameraBox}>
            <label htmlFor="post-image">
              <input
                watchedType="file"
                id="post-image"
                name="post-image"
                className={classes.fileInputCustom}
              />
              <Image
                src="/icons/camera.svg"
                alt="icon"
                width={26}
                height={26}
              />
            </label>
            <span className="text-[1.2rem]">0/10</span>
          </div> */}
              <div className={classes.inputBox}>
                <label htmlFor="name">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`${classes.inputCustom} ${
                    errors.title ? `${classes.error}` : ""
                  }`}
                  placeholder="What are you selling or giving away?"
                  {...register("title", { required: "제목은 필수입니다." })}
                />
                <ErrorMsg target={errors.title} />
              </div>

              <div className={classes.inputBox}>
                <label htmlFor="listing-type">Listing type</label>
                <Controller
                  name="type"
                  control={control}
                  // defaultValue=""
                  rules={{ required: "판매 타입은 필수입니다." }}
                  render={({ field: typeField }) => {
                    console.log("🔥 field.value:", typeField.value); // 디버깅
                    console.log(typeof typeField.value, typeField.value);

                    return (
                      <>
                        <div className={classes.btnCollection}>
                          <button
                            type="button"
                            className={`${classes.button} ${
                              typeField.value === "Sale"
                                ? classes["button-selected"]
                                : ""
                            }`}
                            onClick={() => {
                              typeField.onChange("Sale");
                              console.log("type 값:", typeField.value);
                            }}
                          >
                            For Sale
                          </button>
                          <button
                            type="button"
                            className={`${classes.button} ${
                              typeField.value === "Free"
                                ? classes["button-selected"]
                                : ""
                            }`}
                            onClick={() => {
                              typeField.onChange("Free");
                              console.log("type 값:", typeField.value);
                            }}
                          >
                            Free
                          </button>
                        </div>
                        <ErrorMsg target={errors.type} />

                        <Controller
                          name="price"
                          control={control}
                          rules={{
                            // formValues: 폼에 등록된 모든 필드의 현재 값 객체 (별도로 useWatch()나 getValues()를 호출하지 않아도 해당 필드의 유효성 검사 시점에서 다른 필드의 값들도 접근 가능)
                            validate: (value, formValues) => {
                              if (formValues.type === "Free") return true;
                              if (!value) return "가격은 필수입니다.";
                              return true;
                            },
                          }}
                          render={({ field: priceField }) => (
                            <>
                              <input
                                type="text"
                                placeholder={
                                  watch("type") === "Free" ? "" : "₩ price"
                                }
                                className={`${classes.inputCustom} ${
                                  errors.price ? `${classes.error}` : ""
                                } ${
                                  watch("type") === "Free"
                                    ? `${classes.disabled}`
                                    : ""
                                }`}
                                disabled={watch("type") === "Free"}
                                {...priceField}
                                // ⭐️ priceField는 폼과 Input을 연결해주는 모든 필수 속성들인 다음 코드들을 내포하고 있음
                                // name={priceField.name}
                                // value={priceField.value}
                                // onChange={priceField.onChange}
                                // onBlur={priceField.onBlur}
                                // ref={priceField.ref}
                              />
                              <ErrorMsg target={errors.price} />
                            </>
                          )}
                        />

                        {/* <input
                          type="text"
                          id="listing-type"
                          name="listing-type"
                          className={`${classes.inputCustom} ${
                            errors.title ? `${classes.error}` : ""
                          } disabled:bg-[var(--color-grey-200)]`}
                          placeholder={field.value === "Free" ? "" : "₩ price"}
                          {...register("price", {
                            required: "가격은 필수입니다.",
                          })}
                          disabled={field.value === "Free"}
                        />
                        <ErrorMsg target={errors.price} /> */}
                      </>
                    );
                  }}
                />

                {/* 실제로 서버에 전송될 숨겨진 input - useForm의 register 함수는 버튼에 등록 불가능, setValue를 사용하기 위해선 register 함수를 이용해 해당 필드 명시적 등록 필수 & 에러메시지 표시하기 위함 */}
                {/* <input
                    type="hidden"
                    // value={type} // 🚨🚨react-hook-form은 setValue()로 값을 넣어주면 자동으로 내부 상태에서 관리하는데, 외부에서 강제로 value를 지정하면 오히려 리렌더링 간 충돌이 나기 때문에 절대 지정❌❌ -> useForm사용 시에는 useState 또는 value를 주입하는 게 아닌, useWatch&setValue로만 상태관리할 것!!
                    {...register("type", {
                      required: "⬅️ 판매 타입을 선택해주세요.",
                    })}
                  /> */}
              </div>

              <div className={classes.inputBox}>
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  className={`${classes.inputCustom} ${
                    errors.title ? `${classes.error}` : ""
                  }`}
                  rows="10"
                  placeholder="Tell us about your item e.g. brand, material, condition and size. Include anything that you think toue neighbors would like to know."
                  {...register("description", {
                    required: "제품 설명은 필수입니다.",
                  })}
                ></textarea>
                <ErrorMsg target={errors.description} />
              </div>

              <div className={classes.inputBox}>
                <label htmlFor="instructions">Where to meet</label>
                <button
                  id="where"
                  name="where"
                  className={`flex cursor-pointer p-[0.8rem] border border-neutral-400 rounded-[0.6rem]`}
                  onClick={() => setShowSlide(true)}
                >
                  <span className="font-bold">{placeName || "Select"}</span>
                  <Image
                    src="/icons/chevron-right.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="ml-auto"
                  />
                </button>
              </div>
              {/* <ImagePicker label="Your image" name="image" /> */}
              {/* {state.message && <p>{state.message}</p>} */}
              <div className={classes.actions}>{/* <MealsFormSubmit /> */}</div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  link="/market"
                  secondary
                  className="flex-grow justify-center"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  primary
                  className="flex-grow justify-center"
                >
                  등록
                </Button>
              </div>
            </form>
          </main>
        </>
      )}
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ProductAddPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
