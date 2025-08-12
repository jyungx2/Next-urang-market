import useCurrentUserStore from "@/zustand/currentUserStore";
import useSelectedProductStore from "@/zustand/selectedProduct";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

// ❌기존 const socket = io(...)는 컴포넌트가 리렌더링 될 때마다 새 socket 인스턴스를 생성할 위험 O ❌
// ==> ✅ socket 인스턴스를 useRef로 유지해서 리렌더링에 영향을 받지 않도록 useRef로 Socket을 저장 & useEffect 안에서 한 번만 생성하도록 관리하는 게 안정적!
// const socket = io(
//   process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
// ); // Socket 서버에 연결

export default function SocketClient({ roomId, senderId, chatRoom }) {
  const socketRef = useRef(null); // ✅ socket 인스턴스를 ref로 저장
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
      const res = await fetch(`/api/chat/messages?roomId=${roomId}`);
      const data = await res.json();
      console.log("기존 메시지 배열 가져오기 성공!: ", data.messages);
      return data.messages;
    },
    enabled: isQueryValid,
  });

  useEffect(() => {
    if (!router.isReady) return; // hydration 안 끝났으면 undefined
    console.log("CSR: router.query.productId: ", router.query.productId); // CSR에서는 여기서 처음으로 값이 제대로 찍힘

    // 1. 소켓 연결
    socketRef.current = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
    );

    // 2. Room 입장
    socketRef.current.emit("joinRoom", roomId);
    console.log(`🚪 ${currentUser.id}님, room: ${roomId}에 입장!`);

    // 3. 메시지 수신 핸들러 등록
    socketRef.current.on("receiveMessage", (msgFromServer) => {
      queryClient.setQueryData(["messages", roomId], (old) => {
        // 1) "localId" 기반으로 기존 메시지를 찾는다
        const idx = old.findIndex((m) => m.localId === msgFromServer.localId);
        if (idx !== -1) {
          // 2) 있으면 해당 메시지를 서버 버전으로 교체
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

        // 3) 없으면 그냥 새 메시지로 추가 (중복 위험 없음 => 메시지 한 개 중복됐다고 앱이 멈추거나 에러 띄우는 건 UX적으로 최악 & 🤖두번째 이유 챗지피티 찾아보기🤖)
        return [...old, msgFromServer];
      });
    });

    // 4. 언마운트 시 연결 해제
    return () => {
      socketRef.current?.off("receiveMessage");
      socketRef.current?.disconnect(); // 💥 1️⃣ 마운트 후 0.1초 안에 productId가 바뀌거나, 부모 컴포넌트가 리렌더되면서 <SocketClient />가 unmount → remount 됨
      // 2️⃣ 이때 이 disconnect 코드가 호출돼버려서, 서버는 클라이언트 연결을 바로 끊음
      // 3️⃣ 그 다음 새로 마운트된 컴포넌트는 새 socket 객체를 만들어 연결하지만, 이전에 emit했던 sendMessage는 날아가 있음
    };
  }, [router.isReady, senderId, queryClient, roomId]);

  const sendMessage = () => {
    const localId = uuidv4();

    const newMsg = {
      localId,
      senderId, // 실제 로그인 유저 정보로 대체 가능
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
    socketRef.current.emit("sendMessage", newMsg);
    setInput("");
    console.log("✉️ sendMessage 이벤트 수행 완료!");
  };

  // ✅ 3. 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <main className="flex-1 overflow-y-auto p-4 bg-[var(--color-bg)]">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === senderId;

          // ✅ 상대방 메시지에서만, 이전 메시지의 sender와 다를 때 아바타 노출
          const showAvatar =
            !isMe && (i === 0 || messages[i - 1].senderId !== msg.senderId);

          // 새 화자 블록이면 위쪽 여백을 조금 더
          const isNewBlock =
            i === 0 || messages[i - 1].senderId !== msg.senderId;

          // 상대방 프로필 이미지 선택
          const opponentImage =
            msg.senderId === chatRoom?.buyerId
              ? chatRoom?.buyerImage
              : chatRoom?.sellerImage;

          return (
            <div
              key={msg._id || msg.localId} // _id는 서버 응답 기준, localId는 낙관적 UI 기준
              className={`flex items-start gap-4 ${
                // ☑️ 메시지 정렬: 보낸 사람이 현재 로그인 유저와 같다면 오른쪽 정렬
                isMe ? "justify-end" : ""
              } ${
                // ☑️ 새 화자 블록이면 위쪽 여백을 조금 더
                isNewBlock ? "mt-6" : ""
              }`}
            >
              {/* 메시지 보낸 사람이 로그인한 유저가 아닐 때, 상대방 프로필 이미지 표시 */}
              {showAvatar ? (
                <Image
                  // 이때 상대방이 구매자라면 구매자 이미지, 판매자라면 판매자 이미지 표시
                  src={opponentImage}
                  alt="상대 프로필"
                  width={40}
                  height={40}
                  className="rounded-full aspect-square object-cover"
                />
              ) : (
                <div className="w-[40px] h-[40px]" /> // 빈 공간 유지
              )}
              <div
                className={`p-3 rounded-lg shadow max-w-xl ${
                  msg.senderId === senderId
                    ? "bg-[var(--color-primary-400)] text-white"
                    : "bg-white"
                }`}
              >
                <p className="text-xl">{msg.text}</p>
              </div>
            </div>
          );
        })}
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
