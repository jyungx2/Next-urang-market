import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "me", text: "안녕하세요! 이거 아직 판매 중인가요?" },
    { id: 2, sender: "other", text: "네! 아직 판매 중입니다." },
  ]);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  // ✅ WebSocket 연결 (예제)
  useEffect(() => {
    const socket = new WebSocket("wss://your-websocket-url");

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    return () => {
      socket.close();
    };
  }, []);

  // ✅ 스크롤 자동 이동 (최신 메시지 보이기)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now(), sender: "me", text: inputText };
    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    // WebSocket으로 서버에 메시지 전송
    // socket.send(JSON.stringify(newMessage));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="flex justify-center items-center relative p-4">
          <button className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2">
            <Image
              src="/icons/chevron-left.svg"
              alt="icon"
              width={30}
              height={30}
            />
          </button>
          <div className="flex flex-col justify-center items-center ">
            <span className="font-bold text-2xl">테이스트피트니스팀장</span>
            <span className="text-sm font-medium">
              Typically replies in 10 mins
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b p-4 bg-amber-100">
          <div className="flex gap-4 cursor-pointer">
            <div className="relative w-[48px] aspect-square">
              <Image
                src="/images/example.jpg"
                alt="icon"
                fill
                className="rounded-xl"
              />
            </div>

            <div className="flex flex-col gap-2">
              <span>Active</span>
              <span>132만원</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="border p-2 rounded-lg">Set meetup</button>
            <button className="border p-2 rounded-lg">KarrotPay</button>
          </div>
        </div>
      </header>

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
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
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
    </div>
  );
}
