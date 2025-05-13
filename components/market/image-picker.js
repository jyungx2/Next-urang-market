"use client";

import { useRef, useState } from "react";
import classes from "./image-picker.module.css";
import Image from "next/image";
import { Controller } from "react-hook-form";

// ✅ 이미지 업로드 및 미리보기용 컴포넌트 (react-hook-form Controller 연동)
/**
 * 이미지 업로드 + 미리보기 컴포넌트 (FormData 방식용)
 * @param {string} name - react-hook-form에서 사용할 필드명
 * @param {object} control - useForm 훅에서 가져온 control 객체
 * @param {object} rules - 유효성 검사 규칙
 * @param {function} onImagePick - 부모 컴포넌트로 ⭐️실제 File 객체⭐️(base64 문자열로 변환 ❌)를 전달
 */

export default function ImagePicker({ name, control, rules, onImagePick }) {
  const [previewUrl, setPreviewUrl] = useState(null); // 이미지 미리보기 URL

  const fileInputRef = useRef(); // 숨겨진 input을 참조하기 위한 ref

  // 버튼 클릭 시 input[type=file]을 강제 클릭시키는 함수
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // 파일 변경 시 실행되는 핸들러 (onChange를 파라미터로 받아야 react-hook-form과 연결 가능)
  const handleImageChange = async (e, onChange) => {
    const file = e.target.files?.[0];
    console.log("등록한 file 객체: ", file);
    if (!file) return;

    // 기존 URL 제거 후 새로 생성
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(file);
    console.log("미리보기 Url: ", objectUrl);
    setPreviewUrl(objectUrl); // ✅ 미리보기용 상태에 저장

    onChange(file); // ✅ react-hook-form의 value로 등록
    onImagePick?.(file); // 부모 컴포넌트로 전달
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <div className={classes.picker}>
          {/* <label htmlFor={name}>{label}</label> */}
          <div className={classes.controls}>
            {/* 이미지 미리보기 */}
            <div className={classes.preview}>
              {!previewUrl && <p>No image picked yet.</p>}
              {previewUrl && (
                <Image
                  src={previewUrl}
                  alt="The image selected by the user"
                  fill
                />
              )}
            </div>

            {/* 숨겨진 input */}
            <input
              className={classes.input}
              type="file"
              id={name}
              accept="image/png, image/jpeg"
              name={name}
              ref={fileInputRef}
              onChange={(e) => handleImageChange(e, onChange)}
            />

            {/* 커스텀 버튼 */}
            <button
              className={classes.button}
              type="button"
              onClick={triggerFileInput}
            >
              Pick an Image
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
}
