import useCurrentUserStore from "@/zustand/currentUserStore";
import useSelectedProductStore from "@/zustand/selectedProduct";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { use, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
); // Socket 서버에 연결

export default function SocketClient({ roomId, buyerId }) {
  // useState 지우고, useQuery로 상태 통합관리!
  // const [messages, setMessages] = useState([]);
  const queryClient = useQueryClient();
  const { currentUser } = useCurrentUserStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const { selectedProduct } = useSelectedProductStore();

  const isQueryValid = !!roomId && !roomId.includes("undefined");
  const router = useRouter();

  const { data: messages = [] } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await fetch(`/api/messages?roomId=${roomId}`);
      const data = await res.json();
      console.log("기존 메시지 배열 가져오기 성공!: ", data.messages);
      return data.messages;
    },
    enabled: isQueryValid,
  });

  useEffect(() => {
    if (!router.isReady) return; // hydration 안 끝났으면 undefined
    console.log(router.query.productId); // CSR에서는 여기서 처음으로 값이 제대로 찍힘

    // ✅ Room 입장
    socket.emit("joinRoom", roomId);
    console.log(`🚪 ${currentUser.id}님, room: ${roomId}에 입장!`);

    // ✅ 메시지 수신 핸들러 등록
    socket.on("receiveMessage", (msgFromServer) => {
      queryClient.setQueryData(["messages", roomId], (old) => {
        // 1. "localId" 기반으로 기존 메시지를 찾는다
        const idx = old.findIndex((m) => m.localId === msgFromServer.localId);
        if (idx !== -1) {
          // 2. 있으면 해당 메시지를 서버 버전으로 교체
          const updated = [...old];
          updated[idx] = msgFromServer;

          console.log(
            "서버에서 온 진짜 메시지: ObjectId(_id)가 있어야 한다.",
            msgFromServer
          );
          console.log(
            "🖍️ receiveMessage 이벤트 수행: 가짜 메시지 <-> 서버 메시지 교체 완료!",
            updated
          );
          return updated;
        }

        // 3. 없으면 그냥 새 메시지로 추가 (중복 위험 없음 => 메시지 한 개 중복됐다고 앱이 멈추거나 에러 띄우는 건 UX적으로 최악 & 🤖두번째 이유 챗지피티 찾아보기🤖)
        return [...old, msgFromServer];
      });
    });

    // ✅ 컴포넌트 언마운트 시 연결 해제
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [queryClient, roomId]);

  const sendMessage = () => {
    const localId = uuidv4();

    const newMsg = {
      localId,
      senderId: buyerId, // 실제 로그인 유저 정보로 대체 가능
      text: input,
      createdAt: new Date().toISOString(),
      roomId,
    };

    // 1. UI에 바로 반영 **ONLY FOR UX**
    queryClient.setQueryData(["messages", roomId], (old = []) => [
      ...old,
      newMsg,
    ]);

    // 2. 서버로 메시지 전송
    socket.emit("sendMessage", newMsg);
    setInput("");
    console.log("✉️ sendMessage 이벤트 수행 완료!");
  };

  // ✅ 3. 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-bg)]">
        {messages.map((msg) => (
          <div
            key={msg._id || msg.localId} // _id는 서버 응답 기준, localId는 낙관적 UI 기준
            className={`flex items-start gap-4 ${
              msg.senderId === buyerId ? "justify-end" : ""
            }`}
          >
            {msg.senderId !== buyerId && (
              <Image
                src={selectedProduct.writerImage}
                alt="상대 프로필"
                width={40}
                height={40}
                className="rounded-full aspect-square object-cover"
              />
            )}
            <div
              className={`p-3 rounded-lg shadow max-w-xl ${
                msg.senderId === buyerId
                  ? "bg-[var(--color-primary-400)] text-white"
                  : "bg-white"
              }`}
            >
              <p className="text-xl">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      {/* 입력창 */}
      <footer className="sticky bottom-0 flex items-center gap-4 p-4 bg-[var(--color-bg)]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="bg-gray-300 flex-1 p-4 rounded-4xl outline-none"
        />
        <button onClick={sendMessage} className="p-2">
          <Image
            src="/icons/send.svg"
            alt="send-icon"
            width={24}
            height={24}
            className="cursor-pointer"
          />
        </button>
      </footer>
    </>
  );
}
