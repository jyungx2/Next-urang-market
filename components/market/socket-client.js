import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
); // Socket 서버에 연결

export default function SocketClient({ roomId, buyerId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // ✅ Room 입장
    socket.emit("joinRoom", roomId);

    // ✅ 메시지 수신 핸들러 등록
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // ✅ 컴포넌트 언마운트 시 연결 해제
    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    const newMsg = {
      senderId: buyerId, // 실제 로그인 유저 정보로 대체 가능
      text: input,
      createdAt: new Date().toISOString(),
      roomId,
    };

    // ✅ 서버로 메시지 전송
    socket.emit("sendMessage", newMsg);
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
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
            key={msg.id}
            className={`flex items-start gap-4 ${
              msg.sender === "me" ? "justify-end" : ""
            }`}
          >
            {msg.sender !== "me" && (
              <Image
                src="/images/example.jpg"
                alt="상대 프로필"
                width={40}
                height={40}
                className="rounded-full aspect-square object-cover"
              />
            )}
            <div
              className={`p-3 rounded-lg shadow max-w-xl ${
                msg.sender === "me"
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
