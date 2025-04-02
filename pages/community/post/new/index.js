import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import NextLink from "next/link"; // next/link에서 React 컴포넌트용 Link를 가져오기
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import { Toolbar } from "@/components/tiptap/toolbar"; // 사용자 정의 툴바 컴포넌트 (Bold, Image 등 버튼)
import WriteArea from "@/components/tiptap/writearea";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Button from "@/components/ui/button";
import { useRef, useState } from "react";
import { CustomPlaceholder } from "@/extensions/custom-placeholder";
import { Router } from "lucide-react";
import { useRouter } from "next/router";
import { mutate } from "swr";

export default function PostAddPage() {
  const router = useRouter();
  // CATEGORY
  const [category, setCategory] = useState({
    mainCategory: {},
    subCategory: {},
  });

  // TITLE
  const titleRef = useRef();

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
      // Placeholder.configure({
      //   placeholder:
      //     "이웃에게 동네 정보를 공유하거나 물어보세요.\n동네와 주변 지역의 이웃들까지 볼 수 있어요.\n\n잠깐! 거래글은 꼭 [이웃 중고거래]에 올려주세요.\n이웃소식에 거래글을 등록하면 삭제될 수 있습니다.",
      // }),
      CustomPlaceholder,
      //  여기서 "custom-placeholder"는 data-placeholder 속성으로 들어감
      // ❌ 하지만 이 상태만으론 아무것도 보이지 않음
    ],
    content: "", // 초기 에디터 내용
    editorProps: {
      attributes: {
        class:
          "ProseMirror focus:outline-none text-2xl flex-grow leading-relaxed",
      },
    },
  });

  async function handleSubmit(e) {
    e.preventDefault();

    // CONTENT
    const content = editor.getText(); // 최신 에디터 내용을 이 시점에서 가져와야 함!

    // TITLE
    const title = titleRef.current?.value.trim() || "";

    if (category.mainCategory.name === "공지사항" && !title) {
      alert("제목을 입력해주세요!");
      return;
    }

    if (!content) {
      alert("내용을 입력해주세요!");
      return;
    }

    if (!category.mainCategory.name || !category.subCategory.label) {
      alert("카테고리를 선택해주세요!");
      return;
    }

    const res = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({
        title: category.mainCategory.name === "공지사항" ? title : null,
        content,
        mainCategory: category.mainCategory.name,
        subCategory: category.subCategory.label,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("게시글 등록 완료", data);

    // 캐시 무효화
    mutate(
      `/api/posts?mainCategory=${category.mainCategory.slug}&subCategory=${category.subCategory.tab}`
    );

    // 해당 서브카테고리 페이지로 이동
    router.push(
      `/community/${category.mainCategory.slug}?tab=${category.subCategory.tab}`
    );
  }

  return (
    <form
      className="flex flex-col bg-[var(--color-bg)] min-h-screen relative w-full"
      onSubmit={handleSubmit}
    >
      <WriteArea titleRef={titleRef} onCategorySelect={setCategory} />
      {/* 툴바 컴포넌트 (굵게, 이미지 추가, 이모지 등) */}
      <Toolbar editor={editor} />
      {/* 실제 에디터 콘텐츠가 렌더링되는 영역 */}
      <EditorContent editor={editor} className="text-2xl p-8 flex-grow" />

      {/* 커스텀 placeholder */}
      {/* {editor.isEmpty && (
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
      )} */}

      <div className="flex p-8 gap-2">
        <Button
          type="button"
          link="/community"
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
  );
}
