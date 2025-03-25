import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import NextLink from "next/link"; // next/link에서 React 컴포넌트용 Link를 가져오기
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { Toolbar } from "@/components/tiptap/toolbar"; // 사용자 정의 툴바 컴포넌트 (Bold, Image 등 버튼)
import WriteArea from "@/components/tiptap/writearea";
import ButtonGroup from "@/components/tiptap/button-group";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

export default function PostAddPage() {
  // useEditor 훅을 사용하여 Tiptap 에디터 인스턴스 생성
  const editor = useEditor({
    extensions: [
      StarterKit, // 기본 에디터 기능 (Bold, Italic, List 등)
      Image, // 이미지 업로드 기능
      Link.extend({ inclusive: false }).configure({
        autolink: true,
        defaultProtocol: "https",
        protocols: ["http", "https"],
      }),
      HorizontalRule,
      // 🔥 Placeholder.configure({ placeholder: "..." })는 HTML 속성만 채워줄 뿐!
      // 👉 진짜 텍스트를 보여주는 건 CSS에서 ::before로 처리해야 함.
      Placeholder.configure({
        placeholder: "",
      }),
      //  여기서 "custom-placeholder"는 data-placeholder 속성으로 들어감
      // ❌ 하지만 이 상태만으론 아무것도 보이지 않음
    ],
    content: "", // 초기 에디터 내용
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
  });

  // editor가 존재할 때만 렌더링
  if (!editor) return null;

  return (
    <div className="flex flex-col bg-[var(--color-bg)] min-h-screen relative w-full">
      <WriteArea />
      {/* 툴바 컴포넌트 (굵게, 이미지 추가, 이모지 등) */}
      <Toolbar editor={editor} />
      {/* 실제 에디터 콘텐츠가 렌더링되는 영역 */}
      <EditorContent editor={editor} className="text-2xl p-8 flex-grow" />

      {/* 커스텀 placeholder */}
      {editor.isEmpty && (
        <div className="absolute top-79 left-8 text-gray-400 pointer-events-none space-y-1">
          <p>이웃에게 동네 정보를 공유하거나 물어보세요.</p>
          <p>동네와 주변 지역의 이웃들까지 볼 수 있어요.</p>
          <br />
          <p>
            잠깐! 거래글은 꼭{" "}
            <NextLink
              href="/market/product/new"
              className="underline text-[var(--color-primary-500)] pointer-events-auto"
            >
              [이웃 중고거래]
            </NextLink>{" "}
            에 올려주세요.
          </p>
          <p>이웃소식에 거래글을 등록하면 삭제될 수 있습니다.</p>
        </div>
      )}
      <ButtonGroup />
    </div>
  );
}
