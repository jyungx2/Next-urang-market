import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { Toolbar } from "@/components/tiptap/toolbar"; // 사용자 정의 툴바 컴포넌트 (Bold, Image 등 버튼)
import WriteArea from "@/components/tiptap/writearea";

export default function PostAddPage() {
  // useEditor 훅을 사용하여 Tiptap 에디터 인스턴스 생성
  const editor = useEditor({
    extensions: [
      StarterKit, // 기본 에디터 기능 (Bold, Italic, List 등)
      Image, // 이미지 업로드 기능
      Link,
      Placeholder.configure({
        placeholder: "여기에 게시글을 작성하세요...", // 기본 안내 텍스트
      }),
    ],
    content: "", // 초기 에디터 내용
  });

  // editor가 존재할 때만 렌더링
  if (!editor) return null;

  return (
    <div className="bg-amber-100 min-h-screen">
      <WriteArea />
      {/* 툴바 컴포넌트 (굵게, 이미지 추가, 이모지 등) */}
      <Toolbar editor={editor} />
      {/* 실제 에디터 콘텐츠가 렌더링되는 영역 */}
      <EditorContent editor={editor} className="bg-amber-600 text-3xl p-8" />
    </div>
  );
}
