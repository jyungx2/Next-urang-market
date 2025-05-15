import Image from "next/image";
import classes from "./index.module.css";
import ImagePicker from "@/components/market/image-picker";
import { useRouter } from "next/router";
import Layout from "@/components/layout/layout";
import Button from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useCurrentUserStore from "@/zustand/currentUserStore";
import { useState } from "react";

export default function ProductAddPage() {
  const [pickedFile, setPickedFile] = useState(null); // ✅ 원본 File 객체 저장
  const { currentUser } = useCurrentUserStore();
  const router = useRouter();
  const rcode = router.query.rcode;

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      writer: currentUser?.nickname,
      productImage: "",
      title: "",
      price: "",
      description: "",
      location: currentUser?.selectedLocation.keyword.slice(-1)[0],
      rcode,
    },
  });

  const postProduct = useMutation({
    mutationFn: async (productInfo) => {
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
        body: JSON.stringify({ ...rest, productImage: imageUrl }),
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
      <header className={classes.header}>
        <button
          className="absolute top-0 left-0 cursor-pointer"
          onClick={() => router.push("/market")}
        >
          <Image src="/icons/xbtn.svg" alt="btn" height={30} width={30} />
        </button>
        <h1 className="font-bold text-[2.4rem] text-[var(--color-com-bg)]">
          New listing
        </h1>
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
                type="file"
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
              required
              className={classes.inputCustom}
              placeholder="What are you selling or giving away?"
              {...register("title", { required: "제목은 필수입니다." })}
            />
          </div>
          <div className={classes.inputBox}>
            <label htmlFor="listing-type">Listing type</label>
            <div className={classes.btnCollection}>
              <button className={classes.button}>For Sale</button>
              <button className={classes.button}>Free</button>
            </div>

            <input
              type="text"
              id="listing-type"
              name="listing-type"
              className={classes.inputCustom}
              required
              placeholder="$ price"
              {...register("price", { required: "가격은 필수입니다." })}
            />
          </div>
          <div className={classes.inputBox}>
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              id="description"
              name="description"
              className={classes.inputCustom}
              rows="10"
              required
              placeholder="Tell us about your item e.g. brand, material, condition and size. Include anything that you think toue neighbors would like to know."
              {...register("description", {
                required: "제품 설명은 필수입니다.",
              })}
            ></textarea>
          </div>
          <div className={classes.inputBox}>
            <label htmlFor="instructions">Where to meet</label>
            <button
              id="where"
              name="where"
              required
              className={`flex cursor-pointer p-[0.8rem] border border-neutral-400 rounded-[0.6rem]`}
              onClick={() =>
                router.push({
                  pathname: "/market/product/new/choose-location",
                  query: { rcode },
                })
              }
            >
              <span className="font-bold">Select</span>
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
            <Button type="submit" primary className="flex-grow justify-center">
              등록
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

// ✅ Layout 적용되도록 getLayout 설정
ProductAddPage.getLayout = function haveLayout(page) {
  return <Layout>{page}</Layout>;
};
