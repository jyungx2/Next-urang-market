import { Extension } from "@tiptap/core";
import { Decoration, DecorationSet } from "prosemirror-view";
import { Plugin } from "prosemirror-state";

// Next.js 클라이언트 라우터
const router = require("next/router").default;

export const CustomPlaceholder = Extension.create({
  name: "customPlaceholder",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations = [];

            // 에디터 내용이 완전히 비어 있는 경우에만 placeholder 표시
            const isEmpty =
              doc.childCount === 1 && doc.firstChild?.content.size === 0;

            if (isEmpty) {
              // ✅ Decoration.widget의 콜백 함수 안에서 DOM 생성 + 이벤트 바인딩
              const deco = Decoration.widget(
                0,
                () => {
                  const placeholderNode = document.createElement("div");
                  placeholderNode.className = "custom-placeholder";

                  placeholderNode.innerHTML = `
                    <p>이웃에게 동네 정보를 공유하거나 물어보세요.</p>
                    <p>동네와 주변 지역의 이웃들까지 볼 수 있어요.</p>
                    <br />
                    <p>
                      잠깐! 거래글은 꼭
                      <button type="button" id="custom-placeholder-link" class="text-blue-500 underline cursor-pointer">[이웃 중고거래]</button>
                      에 올려주세요.
                    </p>
                    <p>이웃소식에 거래글을 등록하면 삭제될 수 있습니다.</p>
                  `;

                  const link = placeholderNode.querySelector(
                    "#custom-placeholder-link"
                  );
                  if (link) {
                    link.addEventListener("click", (e) => {
                      e.preventDefault();
                      router.push("/market/product/new"); // ✅ Next.js 내부 이동
                    });
                  }

                  return placeholderNode;
                },
                { side: -1 }
              );

              decorations.push(deco);
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
