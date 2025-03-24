import React, { useRef } from "react";
import { Bold, ImageIcon, LinkIcon, Video, Italic } from "lucide-react";

export const Toolbar = ({ editor }) => {
  // input file 요소에 접근하기 위한 ref
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  if (!editor) return null;

  // input file 클릭 트리거 함수
  const triggerImageUpload = () => imageInputRef.current?.click();
  const triggerVideoUpload = () => videoInputRef.current?.click();

  // 이미지 파일 선택 시 호출되는 함수
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // 이미지 삽입
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file); // base64로 변환
    }
  };

  // 비디오 파일 선택 시 호출되는 함수 (비디오 업로드는 임베드 아님)
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      // video 태그 삽입
      editor.commands.insertContent(
        `<video controls class='w-full mt-2'><source src='${url}' /></video>`
      );
    }
  };

  // 링크 삽입
  const addLink = () => {
    const url = window.prompt("링크 주소를 입력하세요");
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  return (
    <div className="flex gap-2 p-2 border-b border-[var(--color-grey-200)] bg-amber-300">
      {/* 숨겨진 input 요소들 (이미지/비디오) */}
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        accept="video/*"
        ref={videoInputRef}
        onChange={handleVideoUpload}
        className="hidden"
      />

      {/* 굵게 */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="p-2 hover:bg-gray-100 rounded"
        title="굵게"
      >
        <Bold size={22} />
      </button>

      {/* 이탤릭 */}
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="p-2 hover:bg-gray-100 rounded"
        title="기울임"
      >
        <Italic size={22} />
      </button>

      {/* 이미지 추가 */}
      <button
        onClick={triggerImageUpload}
        className="p-2 hover:bg-gray-100 rounded"
        title="사진 추가"
      >
        <ImageIcon size={22} />
      </button>

      {/* 동영상 추가 */}
      <button
        onClick={triggerVideoUpload}
        className="p-2 hover:bg-gray-100 rounded"
        title="동영상 추가"
      >
        <Video size={22} />
      </button>

      {/* 링크 추가 */}
      <button
        onClick={addLink}
        className="p-2 hover:bg-gray-100 rounded"
        title="링크 추가"
      >
        <LinkIcon size={22} />
      </button>
    </div>
  );
};
